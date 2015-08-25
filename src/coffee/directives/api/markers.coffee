angular.module("uiGmapgoogle-maps.directives.api")
.factory "uiGmapMarkers", [
  "uiGmapIMarker", "uiGmapPlural", "uiGmapMarkersParentModel", "uiGmap_sync", "uiGmapLogger",
  (IMarker, Plural, MarkersParentModel, _sync, $log) ->
    class Markers extends IMarker
      constructor: ->
        super()
        @template = '<span class="angular-google-map-markers" ng-transclude></span>'
        Plural.extend @,
          doCluster: '=?docluster' #deprecated use type instead; 2.2 we will remove
          clusterOptions: '=clusteroptions'#deprecated use typeOptions instead; 2.2 we will remove
          clusterEvents: '=clusterevents'#deprecated use typeEvents instead; 2.2 we will remove
          modelsByRef: '=modelsbyref'
          type: '=?type' # cluster, spider, default undefined - normal
          typeOptions: '=?typeoptions'
          typeEvents: '=?typeevents'

        $log.info @

      controller: ['$scope', '$element', ($scope, $element) ->
        $scope.ctrlType = 'Markers'
        _.extend @, IMarker.handle($scope, $element)
      ]

      link: (scope, element, attrs, ctrl) ->
        parentModel = undefined
          
        ready = ->
          scope.deferred.resolve()

        IMarker.mapPromise(scope, ctrl).then (map) ->
          mapScope = ctrl.getScope()

          #this is to deal with race conditions in how MarkerClusterer deals with drawing on idle
          mapScope.$watch 'idleAndZoomChanged', ->
            _.defer parentModel.gManager.draw

          parentModel = new MarkersParentModel(scope, element, attrs, map)
          Plural.link(scope, parentModel)
          if scope.control?
            scope.control.getGMarkers = ->
              parentModel.gManager?.getGMarkers()
            #deprecated use getPlurals
            scope.control.getChildMarkers = ->
              parentModel.plurals

          _.last(parentModel.existingPieces._content).then ->
            ready()
]
