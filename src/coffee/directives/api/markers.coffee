angular.module("uiGmapgoogle-maps.directives.api")
.factory "uiGmapMarkers", [
  "uiGmapIMarker", "uiGmapPlural", "uiGmapMarkersParentModel", "uiGmap_sync", "uiGmapLogger",
  (IMarker, Plural, MarkersParentModel, _sync, $log) ->
    class Markers extends IMarker
      constructor: ->
        super()
        @template = '<span class="angular-google-map-markers" ng-transclude></span>'
        Plural.extend @,
          doRebuildAll: '=dorebuildall' #root level directive attribute not a model level, should default to false
          doCluster: '=docluster'
          clusterOptions: '=clusteroptions'
          clusterEvents: '=clusterevents'
          modelsByRef: '=modelsbyref'

        $log.info @

      controller: ['$scope', '$element', ($scope, $element) ->
        $scope.ctrlType = 'Markers'
        _.extend @, IMarker.handle($scope, $element)
      ]

      link: (scope, element, attrs, ctrl) ->
        parentModel = undefined
        ready = ->
          if scope.control?
            scope.control.getGMarkers = ->
              parentModel.gMarkerManager?.getGMarkers()
            scope.control.getChildMarkers = ->
              parentModel.markerModels
          scope.deferred.resolve()

        IMarker.mapPromise(scope, ctrl).then (map) ->
          mapScope = ctrl.getScope()

          #this is to deal with race conditions in how MarkerClusterer deals with drawing on idle
          mapScope.$watch 'idleAndZoomChanged', ->
            _.defer parentModel.gMarkerManager.draw

          parentModel = new MarkersParentModel(scope, element, attrs, map)
          _.last(parentModel.existingPieces._content).then ->
            ready()
]
