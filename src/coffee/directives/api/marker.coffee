angular.module("uiGmapgoogle-maps.directives.api")
.factory "uiGmapMarker", [
  "uiGmapIMarker", "uiGmapMarkerChildModel", "uiGmapMarkerManager", "uiGmapLogger",
  (IMarker, MarkerChildModel, MarkerManager, $log) ->
    class Marker extends IMarker
      constructor: ->
        super()
        @template = '<span class="angular-google-map-marker" ng-transclude></span>'
        $log.info @

      controller: ['$scope', '$element', ($scope, $element)  ->
        $scope.ctrlType = 'Marker'
        _.extend @, IMarker.handle($scope, $element)
      ]

      link:(scope, element, attrs, ctrl) =>
        mapPromise = IMarker.mapPromise(scope, ctrl)
        mapPromise.then (map) =>
          gMarkerManager = new MarkerManager map

          keys = _.object(IMarker.keys,IMarker.keys)

          m = new MarkerChildModel scope, scope,
            keys, map, {}, doClick = true,
            gMarkerManager, doDrawSelf = false,
            trackModel = false

          m.deferred.promise.then (gMarker) ->
            scope.deferred.resolve gMarker

          if scope.control?
            scope.control.getGMarkers = gMarkerManager.getGMarkers

        scope.$on '$destroy', =>
          gMarkerManager?.clear()
          gMarkerManager = null
]
