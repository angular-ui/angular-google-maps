angular.module("google-maps.directives.api.models.child")
.factory "MarkerChildModel", [ "ModelKey", "GmapUtil", "Logger", "$injector", "EventsHelper",
  (ModelKey, GmapUtil, $log, $injector, EventsHelper) ->
      class MarkerChildModel extends ModelKey
        @include GmapUtil
        @include EventsHelper
        constructor: (@model, @parentScope, @gMap, @$timeout, @defaults, @doClick, @gMarkerManager, @idKey = "id", @doDrawSelf = true)->
          @id = @model[@idKey] if @model[@idKey]?
          @iconKey = @parentScope.icon
          @coordsKey = @parentScope.coords
          @clickKey = @parentScope.click()
          @optionsKey = @parentScope.options
          @needRedraw = false

          super(@parentScope.$new(false))

          @scope.model = @model
          @setMyScope(@model, undefined, true)
          @createMarker(@model)

          @scope.$watch 'model', (newValue, oldValue) =>
            if (newValue != oldValue)
              @setMyScope newValue, oldValue
              @needRedraw = true
          , true

          $log.info @
          @watchDestroy(@scope)

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
          if @parentScope.options and !@scope.options
            $log.error('Options not found on model!')


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

        destroy: () =>
          if @gMarker? #this is possible due to _async in that we created some Children but no gMarker yet
            @removeEvents @externalListeners
            @removeEvents @internalListeners
            @gMarkerManager.remove @gMarker, true
            delete @gMarker
            @scope.$destroy()

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
          @opts = @createMarkerOptions(scope.coords, scope.icon, scope.options)

          delete @gMarker
          if scope.isLabel
            @gMarker = new MarkerWithLabel @setLabelOptions @opts
          else
            @gMarker = new google.maps.Marker(@opts)

          #hook external event handlers for events
          @externalListeners = @setEvents @gMarker, @parentScope, @model, ignore = ['dragend']
          @internalListeners = @setEvents @gMarker, events:@internalEvents(), @model

          @gMarker.key = @id if @id?
          @gMarkerManager.add @gMarker

        setLabelOptions: (opts) =>
          opts.labelAnchor = @getLabelPositionPoint opts.labelAnchor
          opts

        internalEvents: =>
          dragend: (marker,eventName,model,mousearg) =>
            newCoords = @setCoordsFromEvent @modelOrKey(@scope.model,@coordsKey), @gMarker.getPosition()
            @scope.model = @setVal(model,@coordsKey,newCoords)
            @parentScope.events?.dragend(marker,eventName,@scope.model,mousearg) if @parentScope.events?.dragend?
            @scope.$apply()
          click: =>
            if @doClick and @scope.click?
              @scope.click()
              @scope.$apply()

        watchDestroy: (scope )=>
          scope.$on "$destroy", @destroy

      MarkerChildModel
  ]