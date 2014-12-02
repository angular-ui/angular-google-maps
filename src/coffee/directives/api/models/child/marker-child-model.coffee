angular.module('uiGmapgoogle-maps.directives.api.models.child')
.factory 'uiGmapMarkerChildModel', [
  'uiGmapModelKey', 'uiGmapGmapUtil',
  'uiGmapLogger', 'uiGmapEventsHelper', 'uiGmapPropertyAction',
  'uiGmapMarkerOptions', 'uiGmapIMarker', 'uiGmapMarkerManager', 'uiGmapPromise',
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
        @idKey = @idKeyKey or 'id'
        @id = @model[@idKey] if @model[@idKey]?

        super(scope)

        @scope.getGMarker = =>
          @gMarker

        @firstTime = true
        if @trackModel
          @scope.model = @model
          @scope.$watch 'model', (newValue, oldValue) =>
            if (newValue != oldValue)
              @handleModelChanges newValue, oldValue
          , true
        else
          action = new PropertyAction (calledKey, newVal) =>
            #being in a closure works , direct to setMyScope is not working (but should?)
            if not @firstTime
              @setMyScope calledKey, scope
          , false

          _.each @keys, (v, k) ->
            scope.$watch k, action.sic, true

        #hiding destroy functionality as it should only be called via scope.$destroy()
        @scope.$on '$destroy', =>
          destroy @

        @setMyScope 'all', @model, undefined, true
        @createMarker @model
        $log.info @


      destroy: (removeFromManager = true)=>
        @removeFromManager = removeFromManager
        @scope.$destroy()

      handleModelChanges: (newValue, oldValue) =>
        changes = @getChanges newValue, oldValue, IMarker.keys
        if not @firstTime
          ctr = 0
          len = _.keys(changes).length
          _.each changes, (v, k) =>
            ctr += 1
            doDraw = len == ctr
            @setMyScope k, newValue, oldValue, false, true, doDraw
            @needRedraw = true

      updateModel: (model) =>
        @setMyScope 'all', _.clone(model,true), @model

      renderGMarker: (doDraw = true, validCb) ->
        #doDraw is to only update the marker on the map when it is really ready
        if @getProp('coords', @scope, @model)?
          if !@validateCoords @getProp('coords', @scope, @model)
            $log.debug 'MarkerChild does not have coords yet. They may be defined later.'
            return

          validCb() if validCb?
          @gMarkerManager.add @gMarker if doDraw and @gMarker

        else
          @gMarkerManager.remove @gMarker if doDraw and @gMarker


      setMyScope: (thingThatChanged, model, oldModel = undefined, isInit = false, doDraw = true) =>
        if not model?
          model = @model
        else
          @model = model

        if !@gMarker
          @setOptions @scope, doDraw
          justCreated = true
        switch thingThatChanged
          when 'all'
            _.each @keys, (v, k) =>
              @setMyScope k, model, oldModel, isInit, doDraw
          when 'icon'
            @maybeSetScopeValue 'icon', model, oldModel, @iconKey, @evalModelHandle, isInit, @setIcon, doDraw
          when 'coords'
            @maybeSetScopeValue 'coords', model, oldModel, @coordsKey, @evalModelHandle, isInit, @setCoords, doDraw
          when 'options'
            @createMarker(model, oldModel, isInit, doDraw) if !justCreated

      createMarker: (model, oldModel = undefined, isInit = false, doDraw = true)=>
        @maybeSetScopeValue 'options', model, oldModel, @optionsKey, @evalModelHandle, isInit, @setOptions, doDraw
        @firstTime = false

      maybeSetScopeValue: (scopePropName, model, oldModel, modelKey, evaluate, isInit, gSetter = undefined,
        doDraw = true) =>
          gSetter(@scope, doDraw) if gSetter?
          @gMarkerManager.draw() if @doDrawSelf and doDraw

      isNotValid: (scope, doCheckGmarker = true) =>
        hasNoGmarker = unless doCheckGmarker then false else @gMarker == undefined
        hasIdenticalScopes = unless @trackModel then scope.$id != @scope.$id else false
        hasIdenticalScopes or hasNoGmarker

      setCoords: (scope, doDraw = true) =>
        return if @isNotValid(scope) or !@gMarker?
        @renderGMarker doDraw, =>
          newValue = @getCoords @getProp('coords', scope, @model)
          oldValue = @gMarker.getPosition()
          return if newValue.lng() == oldValue.lng() and newValue.lat() == oldValue.lat()
          @gMarker.setPosition newValue
          @gMarker.setVisible @validateCoords(newValue)

      setIcon: (scope, doDraw = true) =>
        return if @isNotValid(scope) or !@gMarker?
        @renderGMarker doDraw, =>
          oldValue = @gMarker.getIcon()
          newValue = @getProp 'icon', scope, @model
          return if  oldValue == newValue
          @gMarker.setIcon newValue
          coords = @getProp 'coords', scope, @model
          @gMarker.setPosition @getCoords coords
          @gMarker.setVisible @validateCoords coords

      setOptions: (scope, doDraw = true) =>
        return if @isNotValid scope, false
        @renderGMarker doDraw, =>
          coords = @getProp 'coords', scope, @model
          icon = @getProp 'icon', scope, @model
          _options = @getProp 'options', scope, @model
          @opts = @createOptions coords, icon, _options

          #update existing options if it is the same type
          if @gMarker? and (@isLabel(@gMarker) == @isLabel(@opts))
            @gMarker.setOptions @opts
          else
            if not @firstTime
              if @gMarker?
                @gMarkerManager.remove @gMarker
                @gMarker = null

          unless @gMarker
            if @isLabel @opts
              @gMarker = new MarkerWithLabel @setLabelOptions @opts
            else
              @gMarker = new google.maps.Marker @opts
            _.extend @gMarker, model: @model

          #hook external event handlers for events
          @removeEvents @externalListeners if @externalListeners
          @removeEvents @internalListeners if @internalListeners
          @externalListeners = @setEvents @gMarker, @scope, @model, ['dragend']
          #must pass fake $evalAsync see events-helper
          @internalListeners = @setEvents @gMarker, {events: @internalEvents(), $evalAsync: () ->}, @model

          @gMarker.key = @id if @id?

        if @gMarker and (@gMarker.getMap() or @gMarkerManager.type != MarkerManager.type)
          @deferred.resolve @gMarker
        else
          @deferred.reject 'gMarker is null' unless @gMarker
          unless @gMarker?.getMap() and @gMarkerManager.type == MarkerManager.type
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
          modelToSet = @setVal model, @coordsKey, newCoords
          #since we ignored dragend for scope above, if @scope.events has it then we should fire it
          events = @scope.events
          events.dragend(marker, eventName, modelToSet, mousearg) if events?.dragend?
          @scope.$apply()
        click: (marker, eventName, model, mousearg) =>
          click = @getProp 'click', @scope, @model
          if @doClick and click?
            @scope.$evalAsync click marker, eventName, @model, mousearg

    MarkerChildModel
]
