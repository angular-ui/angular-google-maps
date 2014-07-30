angular.module("google-maps.directives.api")
.factory "Marker", ["IMarker", "MarkerParentModel", "MarkerManager", (IMarker, MarkerParentModel,MarkerManager) ->
    class Marker extends IMarker
      constructor:  ->
        super()
        @template = '<span class="angular-google-map-marker" ng-transclude></span>'
        @$log.info(@)

      controller: ['$scope', '$element', ($scope, $element) =>
        $scope.ctrlType = 'Marker'
        IMarker.handle $scope,$element
      ]
      link: (scope, element, attrs, ctrl) =>
        doFit = true if scope.fit
        IMarker.mapPromise(scope,ctrl).then (map) =>
          @gMarkerManager = new MarkerManager map unless @gMarkerManager
          new MarkerParentModel scope, element, attrs, map, @$timeout, @gMarkerManager, doFit
          scope.deferred.resolve()

          if scope.control?
            scope.control.getGMarkers = @gMarkerManager.getGMarkers
  ]