angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapPolygons', [
  'uiGmapIPolygon', '$timeout', 'uiGmaparray-sync', 'uiGmapPolygonsParentModel',
  (Interface, $timeout, arraySync, ParentModel) ->
    class Polygons extends Interface
      constructor: () ->
        super()
        @scope.idKey = '=idkey' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
        @scope.models = '=models' #if undefined it will try get a markers models
        #deprecating doRebuildAll, not even going to add it to Polygons
        @$log.info @

      link: (scope, element, attrs, mapCtrl) =>
        # Validate required properties
        if angular.isUndefined(scope.path) or scope.path is null
          @$log.error 'polygons: no valid path attribute found'
          return

        unless scope.models
          @$log.error 'polygons: no models found to create from'
          return

        # Wrap polyline initialization inside a $timeout() call to make sure the map is created already
        mapCtrl.getScope().deferred.promise.then (map) =>
          new ParentModel scope, element, attrs, map, @DEFAULTS
]
