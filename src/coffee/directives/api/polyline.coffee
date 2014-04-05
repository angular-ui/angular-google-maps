angular.module("google-maps.directives.api")
.factory "Polyline", ["IPolyline", "$timeout", "array-sync", "PolylineChildModel",
    (IPolyline, $timeout, arraySync, PolylineChildModel) ->
        class Polyline extends IPolyline
            link: (scope, element, attrs, mapCtrl) =>
                # Validate required properties
                if angular.isUndefined(scope.path) or scope.path is null or
                not @validatePath(scope.path)
                    @$log.error "polyline: no valid path attribute found"
                    return

                # Wrap polyline initialization inside a $timeout() call to make sure the map is created already
                $timeout =>
                    new PolylineChildModel scope, attrs, mapCtrl.getMap(), @DEFAULTS
    ]