angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapPolylines', [
  'uiGmapIPolyline', '$timeout', 'uiGmaparray-sync', 'uiGmapPolylinesParentModel',
    (IPolyline, $timeout, arraySync, PolylinesParentModel) ->
        class Polylines extends IPolyline
            constructor:() ->
                super()
                @scope.idKey = '=idkey' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
                @scope.models = '=models' #if undefined it will try get a markers models
                #deprecating doRebuildAll, not even going to add it to polylines
                @$log.info @

            link: (scope, element, attrs, mapCtrl) =>
                # Wrap polyline initialization inside a $timeout() call to make sure the map is created already
                mapCtrl.getScope().deferred.promise.then (map) =>
                  # Validate required properties
                  if angular.isUndefined(scope.path) or scope.path is null
                    @$log.warn 'polylines: no valid path attribute found'

                  unless scope.models
                    @$log.warn 'polylines: no models found to create from'
                  new PolylinesParentModel scope, element, attrs, map, @DEFAULTS
    ]
