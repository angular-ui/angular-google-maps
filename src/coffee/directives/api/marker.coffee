angular.module("google-maps.directives.api")
.factory "Marker", ["IMarker", "MarkerParentModel", "MarkerManager", "$q", (IMarker, MarkerParentModel,MarkerManager, $q) ->
    class Marker extends IMarker
      constructor: ($timeout) ->
        super($timeout)
        @template = '<span class="angular-google-map-marker" ng-transclude></span>'
        @$log.info(@)

      controller: ['$scope', '$element', ($scope, $element) =>
        $scope.deferred = $q.defer()
        $scope.ctrlType = 'Marker'
        getScope: ->
          $scope
      ]
      link: (scope, element, attrs, ctrl) =>
        super scope, element, attrs, ctrl
        doFit = true if scope.fit

        mapScope = ctrl.getScope()
        mapScope.deferred.promise.then (map) =>
          scope.map = map
          @gMarkerManager = new MarkerManager map unless @gMarkerManager
          new MarkerParentModel scope, element, attrs, ctrl, @$timeout, @gMarkerManager, doFit
          scope.deferred.resolve()
  ]