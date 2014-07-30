angular.module("google-maps.directives.api")
.factory "Marker", ["IMarker", "MarkerParentModel", "MarkerManager", "CtrlHandle", (IMarker, MarkerParentModel,MarkerManager, CtrlHandle) ->
    class Marker extends IMarker
      constructor: ($timeout) ->
        super($timeout)
        @template = '<span class="angular-google-map-marker" ng-transclude></span>'
        @$log.info(@)

      controller: ['$scope', '$element', ($scope, $element) =>
        $scope.ctrlType = 'Marker'
        CtrlHandle.handle $scope,$element
      ]
      link: (scope, element, attrs, ctrl) =>
        super scope, element, attrs, ctrl
        doFit = true if scope.fit
        @mapPromise(scope,ctrl).then (map) =>
          @gMarkerManager = new MarkerManager map unless @gMarkerManager
          new MarkerParentModel scope, element, attrs, map, @$timeout, @gMarkerManager, doFit
          scope.deferred.resolve()
  ]