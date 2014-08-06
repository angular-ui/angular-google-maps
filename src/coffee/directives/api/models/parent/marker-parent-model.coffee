###
	Basic Directive api for a marker. Basic in the sense that this directive contains 1:1 on scope and model.
	Thus there will be one html element per marker within the directive.
###
angular.module("google-maps.directives.api.models.parent")
.factory "MarkerParentModel", ["IMarkerParentModel", "GmapUtil", "EventsHelper", "ModelKey"
    (IMarkerParentModel, GmapUtil, EventsHelper) ->
      # TODO: Eventually this directive should be using marker-child-model (for this to happen something will need to be done with parentScope)
      # currently this Parent directive is acting as a child where Marker is creating MarkerParentModel which directly creates a Marker (MarkerChild does the same)
      class MarkerParentModel extends IMarkerParentModel
        @include GmapUtil
        @include EventsHelper
        constructor: (scope, element, attrs, map, $timeout, @gMarkerManager, @doFit) ->
          super(scope, element, attrs, map, $timeout)
          opts = @createMarkerOptions scope.coords, scope.icon, scope.options, @map
          #using scope.$id as the identifier for a marker as scope.$id should be unique, no need for an index (as it is the index)
          @setGMarker new google.maps.Marker(opts)

          @listener = google.maps.event.addListener @scope.gMarker, 'click', =>
            if @doClick and scope.click?
              @scope.click()

          @setEvents @scope.gMarker, scope, scope
          @$log.info(@)


        onWatch: (propNameToWatch, scope) =>
          switch propNameToWatch
            when 'coords'
              if (@validateCoords(scope.coords) and @scope.gMarker?)
                pos = @scope.gMarker?.getPosition()
                return if(pos.lat() == @scope.coords.latitude and @scope.coords.longitude == pos.lng())
                old = @scope.gMarker.getAnimation()
                @scope.gMarker.setMap @map
                @scope.gMarker.setPosition @getCoords(scope.coords)
                @scope.gMarker.setVisible @validateCoords(scope.coords)
                @scope.gMarker.setAnimation(old)
              else
                # Remove marker
                @scope.gMarker.setMap null
            when 'icon'
              if (scope.icon? and @validateCoords(scope.coords) and @scope.gMarker?)
                @scope.gMarker.setIcon scope.icon
                @scope.gMarker.setMap null
                @scope.gMarker.setMap @map
                @scope.gMarker.setPosition @getCoords(scope.coords)
                @scope.gMarker.setVisible @validateCoords(scope.coords)
            when 'options'
              if @validateCoords(scope.coords) and scope.options
                @scope.gMarker.setMap(null) if @scope.gMarker?
                @setGMarker new google.maps.Marker @createMarkerOptions(scope.coords, scope.icon, scope.options,@map)

        setGMarker: (gMarker) =>
          if @scope.gMarker
            ret = @gMarkerManager.remove @scope.gMarker, false
            delete @scope.gMarker
            ret
          @scope.gMarker = gMarker
          if @scope.gMarker
            @scope.gMarker.key = @scope.idKey
            @gMarkerManager.add @scope.gMarker, false
            @gMarkerManager.fit() if @doFit

        onDestroy: (scope)=>
          unless @scope.gMarker
            self = undefined
            return
          #remove from gMaps and then free resources
          @scope.gMarker.setMap null
          google.maps.event.removeListener @listener
          @listener = null
          @gMarkerManager.remove @scope.gMarker, false
          delete @scope.gMarker
          self = undefined

      return MarkerParentModel
  ]