angular.module("google-maps.directives.api".ns())
.factory "Marker".ns(), ["IMarker".ns(), "MarkerChildModel".ns(), "MarkerManager".ns(),
  "PropertyAction".ns(),
  (IMarker, MarkerChildModel, MarkerManager, PropertyAction) ->

    watchChildMarker = (child, scope) ->
        action = new PropertyAction child.setMyScope, false
        scope.$watchCollection(scope,action.sic)
        IMarker.keys.forEach (k) ->
           #to debug and know who the calling change is from
          scope.$watch(k, action.sic, true)

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

          keys = _.object(IMarker.keys,IMarker.keys)

          m = new MarkerChildModel scope, scope,
            keys, map, {}, doClick = true,
            @gMarkerManager, doDrawSelf = false,
            trackModel = false

          @promise= m.deferred.promise.then (gMarker) =>
            watchChildMarker m, scope
            scope.deferred.resolve(gMarker)

          if scope.control?
            scope.control.getGMarkers = @gMarkerManager.getGMarkers
]
