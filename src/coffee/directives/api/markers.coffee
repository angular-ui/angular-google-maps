angular.module("uiGmapgoogle-maps.directives.api")
.factory "uiGmapMarkers", ["uiGmapIMarker", "uiGmapMarkersParentModel","uiGmap_sync", (IMarker, MarkersParentModel,_sync) ->
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
        modelsByRef: '=modelsbyref'

      @$log.info @

    controller: ['$scope', '$element', ($scope, $element) ->
      $scope.ctrlType = 'Markers'
      _.extend @, IMarker.handle($scope,$element)
    ]

    link: (scope, element, attrs, ctrl) =>
      parentModel = undefined
      ready = =>
        if scope.control?
          scope.control.getGMarkers = =>
            parentModel.gMarkerManager?.getGMarkers()
          scope.control.getChildMarkers = =>
            parentModel.markerModels
        scope.deferred.resolve()

      IMarker.mapPromise(scope, ctrl).then (map) =>
        mapScope = ctrl.getScope()

        #this is to deal with race conditions in how MarkerClusterer deals with drawing on idle
        mapScope.$watch 'idleAndZoomChanged', ->
          _.defer parentModel.gMarkerManager.draw

        parentModel = new MarkersParentModel(scope, element, attrs, map)
        parentModel.existingPieces.then ->
          ready()

]
