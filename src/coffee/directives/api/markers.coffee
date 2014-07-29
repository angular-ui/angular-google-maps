angular.module("google-maps.directives.api")
.factory "Markers", ["IMarker", "MarkersParentModel", (IMarker, MarkersParentModel) ->
  class Markers extends IMarker
    constructor: ($timeout) ->
      super($timeout)
      @template = '<span class="angular-google-map-markers" ng-transclude></span>'
      @scope = _.extend @scope or {},
        idKey: '=idkey' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
        doRebuildAll: '=dorebuildall' #root level directive attribute not a model level, should default to false
        models: '=models'
        doCluster: '=docluster'
        clusterOptions: '=clusteroptions'
        clusterEvents: '=clusterevents'
        isLabel: '=islabel' #if is truthy consult http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerwithlabel/1.1.9/docs/reference.html for additional options documentation

      @$timeout = $timeout
      @$log.info @

    controller: ['$scope', '$element', ($scope, $element) ->
      $scope.ctrlType = 'Markers'
      IMarker.handle $scope,$element
    ]

    link: (scope, element, attrs, ctrl) =>
      IMarker.mapPromise(scope, ctrl).then (map) =>
        parentModel = new MarkersParentModel(scope, element, attrs, map, @$timeout)
        scope.deferred.resolve()
        if scope.control?
          scope.control.getGMarkers = =>
            parentModel.gMarkerManager?.getGMarkers()
          scope.control.getChildMarkers = =>
            parentModel.markerModels
]
