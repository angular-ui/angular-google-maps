angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapPolygons', [
  'uiGmapIPolygon', '$timeout', 'uiGmaparray-sync', 'uiGmapPolygonsParentModel', 'uiGmapPlural',
  (Interface, $timeout, arraySync, ParentModel, Plural) ->
    class Polygons extends Interface
      constructor: ->
        super()
        Plural.extend @
        @$log.info @

      link: (scope, element, attrs, mapCtrl) =>
        # Wrap polyline initialization inside a $timeout() call to make sure the map is created already
        mapCtrl.getScope().deferred.promise.then (map) =>
            # Validate required properties
          if angular.isUndefined(scope.path) or scope.path is null
            @$log.warn 'polygons: no valid path attribute found'

          unless scope.models
            @$log.warn 'polygons: no models found to create from'
          parent = null
          if scope.control?
            scope.control.updateModels = (models) ->
              scope.models = models
              parent.createChildScopes(false)
            scope.control.newModels = (models) ->
              scope.models = models
              parent.rebuildAll(scope, true, true)

            scope.control.clean = ->
              parent.rebuildAll(scope, false, true)
          parent = new ParentModel scope, element, attrs, map, @DEFAULTS


]
