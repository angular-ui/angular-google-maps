angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapPolylines', [
  'uiGmapIPolyline', '$timeout', 'uiGmaparray-sync', 'uiGmapPolylinesParentModel', 'uiGmapPlural',
  (IPolyline, $timeout, arraySync, PolylinesParentModel, Plural) ->
    class Polylines extends IPolyline
      constructor: () ->
        super()
        Plural.extend @
        @$log.info @

      link: (scope, element, attrs, mapCtrl) =>
        # Wrap polyline initialization inside a $timeout() call to make sure the map is created already
        mapCtrl.getScope().deferred.promise.then (map) =>
          # Validate required properties
          if angular.isUndefined(scope.path) or scope.path is null
            @$log.warn 'polylines: no valid path attribute found'

          unless scope.models
            @$log.warn 'polylines: no models found to create from'
          Plural.link scope, new PolylinesParentModel(scope, element, attrs, map, @DEFAULTS)
]
