angular.module("google-maps.directives.api.models.child".ns())
.factory "MarkerChildModel".ns(), [ "ModelKey".ns(), "GmapUtil".ns(),
  "Logger".ns(), "EventsHelper".ns(),"PropertyAction".ns(),
  "MarkerOptions".ns(), "IMarker".ns(), "MarkerManager".ns(), "uiGmapPromise",
  (ModelKey, GmapUtil, $log, EventsHelper, PropertyAction, MarkerOptions, IMarker, MarkerManager, uiGmapPromise) ->
    keys = ['coords', 'icon', 'options', 'fit']
    class MarkerChildModel extends ModelKey
      @include GmapUtil
      @include EventsHelper
      @include MarkerOptions

      destroy = (child) ->
        if child?.gMarker?
          child.removeEvents child.externalListeners
          child.removeEvents child.internalListeners
          if child?.gMarker
            child.gMarkerManager.remove child.gMarker if child.removeFromManager
            child.gMarker.setMap null
            child.gMarker = null

      constructor: (scope, @model, @keys, @gMap, @defaults, @doClick, @gMarkerManager, @doDrawSelf = true,

        @trackModel = true, @needRedraw = false) ->
        @deferred = uiGmapPromise.defer()
        _.each @keys, (v, k) =>
          @[k + 'Key'] = if _.isFunction @keys[k] then @keys[k]() else @keys[k]
        @idKey = @idKeyKey or "id"
        @id = @model[@idKey] if @model[@idKey]?

        super(scope)

        @setMyScope('all',@model, undefined, true)
        @scope.getGMarker = =>
          @gMarker
        @createMarker(@model)
        firstTime =  true
        if @trackModel
          @scope.model = @model
          @scope.$watch 'model', (newValue, oldValue) =>
            if (newValue != oldValue)
              changes = @getChanges(newValue,oldValue, IMarker.keys)
              _.each changes, (v, k) =>
                @setMyScope k, newValue, oldValue
                @needRedraw = true
          , true
        else
          action = new PropertyAction  (calledKey, newVal) =>
            @setMyScope(calledKey,scope) #being in a closure works , direct to setMyScope is not working (but should?)
          , false
          _.each @keys, (v, k) ->
            scope.$watch(k, action.sic, true)

        #hiding destroy functionality as it should only be called via scope.$destroy()
        @scope.$on "$destroy", =>
          destroy @

        $log.info @

      destroy: (removeFromManager = true)=>
        @removeFromManager = removeFromManager
        @scope.$destroy()

      setMyScope: (thingThatChanged, model, oldModel = undefined, isInit = false) =>
        model = @model unless model?
        if !@gMarker
          @setOptions(@scope)
          justCreated = true
        switch thingThatChanged
          when 'all'
            _.each @keys, (v,k) =>
              @setMyScope k, model, oldModel, isInit
          when 'icon'
            @maybeSetScopeValue('icon', model, oldModel, @iconKey, @evalModelHandle, isInit, @setIcon)
          when 'coords'
            @maybeSetScopeValue('coords', model, oldModel, @coordsKey, @evalModelHandle, isInit, @setCoords)
          when 'options'
            @createMarker(model, oldModel, isInit) if !justCreated

      createMarker: (model, oldModel = undefined, isInit = false)=>
        @maybeSetScopeValue 'options', model, oldModel, @optionsKey, @evalModelHandle, isInit, @setOptions

      maybeSetScopeValue: (scopePropName, model, oldModel, modelKey, evaluate, isInit, gSetter = undefined) =>
        if oldModel == undefined
          @scope[scopePropName] = evaluate(model, modelKey)
          gSetter(@scope) if gSetter?
          return

        oldVal = evaluate(oldModel, modelKey)
        newValue = evaluate(model, modelKey)
        if newValue != oldVal
          @scope[scopePropName] = newValue
          unless isInit
            gSetter(@scope) if gSetter?
            @gMarkerManager.draw() if @doDrawSelf

      isNotValid:(scope, doCheckGmarker = true) =>
        hasNoGmarker = unless doCheckGmarker then false else @gMarker == undefined
        hasIdenticalScopes = unless @trackModel then scope.$id != @scope.$id else false
        hasIdenticalScopes or hasNoGmarker

      setCoords: (scope) =>
        return if @isNotValid(scope) or  !@gMarker?
        if @getProp(@coordsKey,@model)?
          if !@validateCoords(@getProp(@coordsKey,@model))
            $log.debug "MarkerChild does not have coords yet. They may be defined later."
            return
          @gMarker.setPosition @getCoords(@getProp(@coordsKey,@model))
          @gMarker.setVisible @validateCoords(@getProp(@coordsKey,@model))

          @gMarkerManager.add @gMarker
        else
          @gMarkerManager.remove @gMarker

      setIcon: (scope) =>
        return if @isNotValid(scope) or  !@gMarker?
        # @gMarkerManager.remove @gMarker
        @gMarker.setIcon @getProp(@iconKey,@model)
        @gMarkerManager.add @gMarker
        @gMarker.setPosition @getCoords(@getProp(@coordsKey,@model))
        @gMarker.setVisible @validateCoords(@getProp(@coordsKey,@model))

      setOptions: (scope) =>
        return if @isNotValid scope, false

        unless scope.coords?
          return
        coords = @getProp(@coordsKey,@model)
        icon = @getProp(@iconKey,@model)
        _options = @getProp(@optionsKey,@model)
        @opts = @createOptions(coords,icon,_options)

        if @gMarker? and (@isLabel @gMarker == @isLabel @opts)
          @gMarker.setOptions @opts
        else
          if @gMarker?
            @gMarkerManager.remove @gMarker
            @gMarker = null

        unless @gMarker
          if @isLabel @opts
            @gMarker = new MarkerWithLabel @setLabelOptions @opts
          else
            @gMarker = new google.maps.Marker(@opts)

        #hook external event handlers for events
        @removeEvents @externalListeners if @externalListeners
        @removeEvents @internalListeners if @internalListeners
        @externalListeners = @setEvents @gMarker, @scope, @model, ['dragend']
        #must pass fake $evalAsync see events-helper
        @internalListeners = @setEvents @gMarker, {events: @internalEvents(), $evalAsync: () ->}, @model

        @gMarker.key = @id if @id?
        @gMarkerManager.add @gMarker

        if @gMarker and (@gMarker.getMap() or @gMarkerManager.type != MarkerManager.type)
          @deferred.resolve @gMarker
        else
          @deferred.reject "gMarker is null" unless @gMarker
          unless @gMarker.getMap() and @gMarkerManager.type == MarkerManager.type
            $log.warn 'gMarker has no map yet'
            @deferred.resolve @gMarker

        if @model[@fitKey]
          @gMarkerManager.fit()


      setLabelOptions: (opts) =>
        opts.labelAnchor = @getLabelPositionPoint opts.labelAnchor
        opts

      internalEvents: =>
        dragend: (marker, eventName, model, mousearg) =>
          modelToSet = if @trackModel then @scope.model else @model
          newCoords = @setCoordsFromEvent @modelOrKey(modelToSet, @coordsKey), @gMarker.getPosition()
          modelToSet = @setVal(model, @coordsKey, newCoords)
          #since we ignored dragend for scope above, if @scope.events has it then we should fire it
          events = @scope.events
          events.dragend(marker, eventName, modelToSet, mousearg) if events?.dragend?
          @scope.$apply()
        click: (marker, eventName, model, mousearg) =>
          click = if _.isFunction(@clickKey) then @clickKey else @getProp @clickKey, @model
          if @doClick and click?
            @scope.$evalAsync click(marker, eventName, @model, mousearg)

    MarkerChildModel
]
