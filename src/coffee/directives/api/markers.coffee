angular.module("google-maps.directives.api")
.factory "Markers", ["IMarker", "MarkersParentModel", "CtrlHandle", (IMarker, MarkersParentModel, CtrlHandle) ->
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
        labelContent: '=labelcontent'
        labelAnchor: '@labelanchor'
        labelClass: '@labelclass'

      @$timeout = $timeout
      self = @
      @$log.info @

    controller: ['$scope', '$element', ($scope, $element) ->
      $scope.ctrlType = 'Markers'
      CtrlHandle.handle $scope,$element
    ]

    link: (scope, element, attrs, ctrl) =>
      @mapPromise(scope, ctrl).then (map) =>
        new MarkersParentModel(scope, element, attrs, map, @$timeout)
        scope.deferred.resolve()
]
