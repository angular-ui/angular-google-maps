angular.module("google-maps.directives.api")
.factory "Marker", ["IMarker", "MarkerParentModel", "MarkerManager", "$q", (IMarker, MarkerParentModel,MarkerManager, $q) ->
    class Marker extends IMarker
      constructor: ($timeout) ->
        super($timeout)
        self = @
        @template = '<span class="angular-google-map-marker" ng-transclude></span>'
        @$log.info(@)

      controller: ['$scope', '$element', ($scope, $element) =>
        getMarkerScope: ->
          $scope
      ]
      link: (scope, element, attrs, ctrl) =>
        doFit = true if scope.fit
        deferred = $q.defer()
        @$timeout =>
          @gMarkerManager = new MarkerManager ctrl.getMap() unless @gMarkerManager
          new MarkerParentModel scope, element, attrs, ctrl, @$timeout, @gMarkerManager, doFit
          deferred.resolve()
        scope.isReady = deferred.promise;
  ]