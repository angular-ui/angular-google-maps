angular.module("google-maps.directives.api.models.parent".ns())
.factory "MarkersParentModel".ns(), [
  "IMarkerParentModel".ns(), "ModelsWatcher".ns(),
  "PropMap".ns(), "MarkerChildModel".ns(), "_async".ns(),
  "ClustererMarkerManager".ns(), "MarkerManager".ns(), "$timeout", "IMarker".ns(),
    (IMarkerParentModel, ModelsWatcher,
      PropMap, MarkerChildModel, _async,
      ClustererMarkerManager, MarkerManager,$timeout,IMarker) ->
        class MarkersParentModel extends IMarkerParentModel
            @include ModelsWatcher
            constructor: (scope, element, attrs, map) ->
                super(scope, element, attrs, map)
                self = @

                @$log.info @
                @setIdKey scope

                #watch all the below properties with end up being processed by onWatch below
                @watch('models', scope, scope.$eval(attrs.modelsbyref))
                @watch('doCluster', scope)
                @watch('clusterOptions', scope)
                @watch('clusterEvents', scope)
                @watch('fit', scope)
                @watch('idKey', scope)
                @gMarkerManager = undefined
                @createMarkersFromScratch(scope)

                # listen for map "idle" event. If map was resized, redraw whole
                # mapview or update only portion of view which is needed
                google.maps.event.addListener @map, "idle", ->
                  if self.isMapResized() || !self.initialized
                    # during first idle, force redraw map
                    self.redrawMap self.map
                    self.initialized = true
                  else
                    self.updateView.bind(self)(scope)


            onWatch: (propNameToWatch, scope, newValue, oldValue) =>
                if propNameToWatch == "idKey" and newValue != oldValue
                    @idKey = newValue
                @reBuildMarkers(scope)

            validateScope: (scope)=>
                modelsNotDefined = angular.isUndefined(scope.models) or scope.models == undefined
                if(modelsNotDefined)
                    @$log.error(@constructor.name + ": no valid models attribute found")

                super(scope) or modelsNotDefined

            createMarkersFromScratch: (scope) =>
                if scope.doCluster
                    if scope.clusterEvents
                      @clusterInternalOptions = do _.once =>
                          self = @
                          unless @origClusterEvents
                              @origClusterEvents =
                                  click: scope.clusterEvents?.click
                                  mouseout: scope.clusterEvents?.mouseout
                                  mouseover: scope.clusterEvents?.mouseover
                              _.extend scope.clusterEvents,
                                  click:(cluster) ->
                                      self.maybeExecMappedEvent cluster, 'click'
                                  mouseout:(cluster) ->
                                      self.maybeExecMappedEvent cluster, 'mouseout'
                                  mouseover:(cluster) ->
                                    self.maybeExecMappedEvent cluster, 'mouseover'

                    if scope.clusterOptions or scope.clusterEvents
                        if @gMarkerManager == undefined
                            @gMarkerManager = new ClustererMarkerManager @map,
                                    undefined,
                                    scope.clusterOptions,
                                    @clusterInternalOptions,
                                    scope,
                                    undefined
                        else
                            if @gMarkerManager.opt_options != scope.clusterOptions
                                @gMarkerManager = new ClustererMarkerManager @map,
                                      undefined,
                                      scope.clusterOptions,
                                      @clusterInternalOptions,
                                      @clusterInternalOptions,
                                      scope,
                                      undefined
                    else
                        @gMarkerManager = new ClustererMarkerManager @map
                else
                    @gMarkerManager = new MarkerManager @map, scope

                if scope.models
                    @gMarkerManager.addMany scope.models
                    @fit(scope.models) if scope.fit
                    @redrawMap @map

            # checks if google map view was resized
            isMapResized: () =>
              $googleMap = @element.parents '.google-map'
              if(!$googleMap.length)
                return false

              newWidth = $googleMap.width()
              newHeight = $googleMap.height()

              ret = false
              if newWidth != @mapWidth || newHeight != @mapHeight
                @mapWidth = newWidth
                @mapHeight = newHeight
                google.maps.event.trigger this.map, "resize"
                ret = true
              ret

            redrawMap: (map) =>
              return if not map
              return if @updateInProgress()

              boundary = @mapBoundingBox map
              zoom = map.zoom
              if boundary and zoom
                @fixBoundaries boundary
                @gMarkerManager.redraw boundary, zoom
              @inProgress = false

            # make sure that we don't trigger map updates too often. some events
            # can be triggered a lot which could stall whole app
            updateInProgress: () =>
              now = new Date()
              # two map updates can happen at least 250ms apart
              if now - @lastUpdate <= 250
                return true
              if @inProgress
                return true
              @inProgress = true
              @lastUpdate = now
              return false

            mapBoundingBox: (map) =>
              if map && map.getBounds
                b = map.getBounds()
                if b
                  ne = b.getNorthEast()
                  sw = b.getSouthWest()
                  boundary = {
                    ne: {
                      lat: ne.lat(),
                      lng: ne.lng()
                    }, sw: {
                      lat: sw.lat(),
                      lng: sw.lng()
                    }
                  }
              boundary

            fixBoundaries: (boundary) =>
              if boundary.ne.lng < boundary.sw.lng
                boundary.sw.lng = if boundary.ne.lng > 0 then -180 else 180

            updateView: (scope) =>
              if @updateInProgress()
                return

              boundary = @mapBoundingBox @map
              if not boundary
                @inProgress = false
                return true

              @fixBoundaries boundary
              @gMarkerManager.draw boundary, @map.zoom
              @inProgress = false

            reBuildMarkers: (scope) =>
              @onDestroy(scope) #clean models

              @createMarkersFromScratch(scope)

            onDestroy: (scope)=>
              #need to figure out how to handle individual destroys
              #slap index to the external model so that when they pass external back
              #for destroy we have a lookup?
              #this will require another attribute for destroySingle(marker)
              @gMarkerManager.clear(true) if @gMarkerManager?

            maybeExecMappedEvent:(cluster, fnName) ->
              if _.isFunction @scope.clusterEvents?[fnName]
                pair = @mapClusterToMarkerModels cluster
                @origClusterEvents[fnName](pair.cluster,pair.mapped) if @origClusterEvents[fnName]

            mapClusterToMarkerModels:(cluster) ->
                gMarkers = cluster.getMarkers()
                mapped = gMarkers.map (g) =>
                    g.data.model.data
                cluster: cluster
                mapped: mapped

            fit: (models) ->
              if models && models.length > 0
                bounds = new google.maps.LatLngBounds();
                everSet = false
                _.each models, (model) =>
                  everSet = true unless everSet
                  bounds.extend(new google.maps.LatLng(model.geo.latitude, model.geo.longitude))
                @map.fitBounds(bounds) if everSet

        return MarkersParentModel
]
