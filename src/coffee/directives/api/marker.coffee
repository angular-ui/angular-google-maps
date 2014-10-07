angular.module("google-maps.directives.api".ns())
.factory "Marker".ns(), ["IMarker".ns(), "MarkerChildModel".ns(), "MarkerManager".ns(),
  (IMarker, MarkerChildModel, MarkerManager) ->
    class Marker extends IMarker
      constructor: ->
        super()
        @template = '<span class="angular-google-map-marker" ng-transclude></span>'
        @$log.info(@)

      controller: ['$scope', '$element', ($scope, $element) =>
        $scope.ctrlType = 'Marker'
        _.extend @, IMarker.handle($scope, $element)
      ]
      link: (scope, element, attrs, ctrl) =>
        doFit = true if scope.fit
        IMarker.mapPromise(scope, ctrl).then (map) =>
          @gMarkerManager = new MarkerManager map unless @gMarkerManager

          keys = _.keys(IMarker.keys)
          keys = _.object(keys,keys)

          @promise = new MarkerChildModel(
            scope, scope, keys, map, {}, doClick = true, @gMarkerManager, doDrawSelf = false,
            trackModel = false).deferred.promise.then (gMarker) =>
              scope.deferred.resolve(gMarker)


          if scope.control?
            scope.control.getGMarkers = @gMarkerManager.getGMarkers
]
