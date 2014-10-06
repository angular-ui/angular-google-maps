angular.module("google-maps.directives.api.models.child".ns())
.factory "MarkerChildModel".ns(), [ "ModelKey".ns(), "GmapUtil".ns(),
"Logger".ns(), "$injector", "EventsHelper".ns(),
"MarkerOptions".ns(),
  (ModelKey, GmapUtil, $log, $injector, EventsHelper, MarkerOptions) ->
      class MarkerChildModel extends ModelKey
        @include GmapUtil
        @include EventsHelper
        @include MarkerOptions

        destroy = (child) ->
          if child?.gMarker?
            child.removeEvents child.externalListeners
            child.removeEvents child.internalListeners
            if child?.gMarker
              child?.gMarkerManager.remove child?.gMarker, true
              delete child.gMarker

        constructor: (scope, @model, @keys, @gMap, @defaults, @doClick, @gMarkerManager, @doDrawSelf = true, @trackModel=true)->
          @idKey= @keys.idKey or "id"
          @id = @model[@idKey] if @model[@idKey]?
          @iconKey = @keys.icon
          @coordsKey = @keys.coords
          @clickKey = @keys.click()
          @optionsKey = @keys.options
          @needRedraw = false
          @deferred = Promise.defer()

          super(scope)

          if @trackModel
            @scope.model = @model
            @scope.$watch 'model', (newValue, oldValue) =>
              if (newValue != oldValue)
                @setMyScope newValue, oldValue
                @needRedraw = true
            , true

          #hiding destroy functionality as it should only be called via scope.$destroy()
          @scope.$on "$destroy", =>
            destroy @

          @setMyScope(@model, undefined, true)
          @createMarker(@model)
          $log.info @

        destroy: =>
          @scope.$destroy()

        setMyScope: (model, oldModel = undefined, isInit = false) =>
          @maybeSetScopeValue('icon', model, oldModel, @iconKey, @evalModelHandle, isInit, @setIcon)
          @maybeSetScopeValue('coords', model, oldModel, @coordsKey, @evalModelHandle, isInit, @setCoords)
          if _.isFunction(@clickKey) and $injector
            @scope.click = () =>
              $injector.invoke(@clickKey, undefined, {"$markerModel": model})
          else
            @maybeSetScopeValue('click', model, oldModel, @clickKey, @evalModelHandle, isInit)
            @createMarker(model, oldModel, isInit)

        createMarker: (model, oldModel = undefined, isInit = false)=>
          @maybeSetScopeValue 'options', model, oldModel, @optionsKey, @evalModelHandle, isInit, @setOptions

        maybeSetScopeValue: (scopePropName, model, oldModel, modelKey, evaluate, isInit, gSetter = undefined) =>
          if oldModel == undefined
            @scope[scopePropName] = evaluate(model, modelKey)
            unless isInit
              gSetter(@scope) if gSetter?
            return

          oldVal = evaluate(oldModel, modelKey)
          newValue = evaluate(model, modelKey)
          if newValue != oldVal
            @scope[scopePropName] = newValue
            unless isInit
              gSetter(@scope) if gSetter?
              @gMarkerManager.draw() if @doDrawSelf

        setCoords: (scope) =>
          if scope.$id != @scope.$id or @gMarker == undefined
            return
          if scope.coords?
            if !@validateCoords(@scope.coords)
              $log.error "MarkerChildMarker cannot render marker as scope.coords as no position on marker: #{JSON.stringify @model}"
              return
            @gMarker.setPosition @getCoords(scope.coords)
            @gMarker.setVisible @validateCoords(scope.coords)

            @gMarkerManager.add @gMarker
          else
            @gMarkerManager.remove @gMarker

        setIcon: (scope) =>
          if scope.$id != @scope.$id or @gMarker == undefined
            return
          @gMarkerManager.remove @gMarker
          @gMarker.setIcon scope.icon
          @gMarkerManager.add @gMarker
          @gMarker.setPosition @getCoords(scope.coords)
          @gMarker.setVisible @validateCoords(scope.coords)

        setOptions: (scope) =>
          if scope.$id != @scope.$id
            return

          if @gMarker?
            @gMarkerManager.remove(@gMarker)
            delete @gMarker
          unless scope.coords ? scope.icon? scope.options?
            return
          @opts = @createOptions(scope.coords, scope.icon, scope.options)

          delete @gMarker
          if @isLabel @opts
            @gMarker = new MarkerWithLabel @setLabelOptions @opts
          else
            @gMarker = new google.maps.Marker(@opts)

          if @gMarker
            @deferred.resolve @gMarker
          else
            @deferred.reject "gMarker is null"


          #hook external event handlers for events
          @removeEvents @externalListeners if @externalListeners
          @removeEvents @internalListeners if @internalListeners
          @externalListeners = @setEvents @gMarker, @scope, @model, ['dragend']
          #must pass fake $apply see events-helper
          @internalListeners = @setEvents @gMarker, {events:@internalEvents(), $apply:() ->}, @model

          @gMarker.key = @id if @id?
          @gMarkerManager.add @gMarker

        setLabelOptions: (opts) =>
          opts.labelAnchor = @getLabelPositionPoint opts.labelAnchor
          opts

        internalEvents: =>
          dragend: (marker,eventName,model,mousearg) =>
            newCoords = @setCoordsFromEvent @modelOrKey(@scope.model,@coordsKey), @gMarker.getPosition()
            @scope.model = @setVal(model,@coordsKey,newCoords)
            #since we ignored dragend for scope above, if @scope.events has it then we should fire it
            @scope.events.dragend(marker,eventName,@scope.model,mousearg) if @scope.events?.dragend?
            @scope.$apply()
          click: =>
            if @doClick and @scope.click?
              @scope.$apply(@scope.click())

      MarkerChildModel
  ]
