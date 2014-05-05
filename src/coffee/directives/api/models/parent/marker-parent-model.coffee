###
	Basic Directive api for a marker. Basic in the sense that this directive contains 1:1 on scope and model.
	Thus there will be one html element per marker within the directive.
###
angular.module("google-maps.directives.api.models.parent")
.factory "MarkerParentModel", ["IMarkerParentModel", "GmapUtil", (IMarkerParentModel, GmapUtil) ->
    # TODO: Eventually this directive should be using marker-child-model (for this to happen something will need to be done with parentScope)
    # currently this Parent directive is acting as a child where Marker is creating MarkerParentModel which directly creates a Marker (MarkerChild does the same)
    class MarkerParentModel extends IMarkerParentModel
      @include GmapUtil
      constructor: (scope, element, attrs, mapCtrl, $timeout, @gMarkerManager, @doFit) ->
        super(scope, element, attrs, mapCtrl, $timeout)
        self = @

      onTimeOut: (scope)=>
        opts = @createMarkerOptions scope.coords, scope.icon, scope.options, @mapCtrl.getMap()
        #using scope.$id as the identifier for a marker as scope.$id should be unique, no need for an index (as it is the index)
        @setGMarker new google.maps.Marker(opts)

        google.maps.event.addListener @scope.gMarker, 'click', =>
          if @doClick and scope.click?
            @$timeout =>
              @scope.click()

        @setEvents(@scope.gMarker, scope)
        @$log.info(@)

      onWatch: (propNameToWatch, scope) =>
        switch propNameToWatch
          when 'coords'
            if (@validateCoords(scope.coords) and @scope.gMarker?)
              @scope.gMarker.setMap(@mapCtrl.getMap())
              @scope.gMarker.setPosition(@getCoords(scope.coords))
              @scope.gMarker.setVisible(@validateCoords(scope.coords))
              @scope.gMarker.setOptions(scope.options)
            else
              # Remove marker
              @scope.gMarker.setMap(null)
          when 'icon'
            if (scope.icon? and @validateCoords(scope.coords) and @scope.gMarker?)
              @scope.gMarker.setOptions(scope.options)
              @scope.gMarker.setIcon(scope.icon)
              @scope.gMarker.setMap(null)
              @scope.gMarker.setMap(@mapCtrl.getMap())
              @scope.gMarker.setPosition(@getCoords(scope.coords))
              @scope.gMarker.setVisible(@validateCoords(scope.coords))
          when 'options'
            if @validateCoords(scope.coords) and scope.icon? and scope.options
              @scope.gMarker.setMap(null) if @scope.gMarker?

               @setGMarker new google.maps.Marker(@createMarkerOptions(scope.coords, scope.icon, scope.options,
                  @mapCtrl.getMap()))

      setGMarker:(gMarker) =>
        delete @scope.gMarker
        @scope.gMarker = gMarker
        if @scope.gMarker
          @gMarkerManager.add @scope.gMarker, false
          @gMarkerManager.fit() if @doFit

      onDestroy: (scope)=>
        if @scope.gMarker == undefined
          self = undefined
          return
        #remove from gMaps and then free resources
        @scope.gMarker.setMap(null)
        delete @scope.gMarker
        self = undefined

      setEvents: (marker, scope) ->
        if angular.isDefined(scope.events) and scope.events? and angular.isObject(scope.events)
          _.compact _.map scope.events, (eventHandler, eventName) ->
            if scope.events.hasOwnProperty(eventName) and angular.isFunction(scope.events[eventName])
              google.maps.event.addListener(marker, eventName, ->
                eventHandler.apply(scope, [marker, eventName, arguments]))

    return MarkerParentModel
  ]