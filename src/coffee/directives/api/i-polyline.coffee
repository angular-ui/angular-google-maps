angular.module("google-maps.directives.api")
.factory "IPolyline", ["GmapUtil", "BaseObject", (GmapUtil, BaseObject) ->
        DEFAULTS = {}
        class IPolyline extends BaseObject
            @include GmapUtil
            constructor:()->
                self = @
            restrict: "ECA"
            replace: true
            require: "^googleMap"
            scope:
                path: "=path"
                stroke: "=stroke"
                clickable: "="
                draggable: "="
                editable: "="
                geodesic: "="
                icons: "=icons"
                visible: "="

            buildOpts:(scope,map,pathPoints) ->
                opts = angular.extend({}, DEFAULTS,
                    map: map
                    path: pathPoints
                    strokeColor: scope.stroke and scope.stroke.color
                    strokeOpacity: scope.stroke and scope.stroke.opacity
                    strokeWeight: scope.stroke and scope.stroke.weight
                )
                angular.forEach
                    clickable: true
                    draggable: false
                    editable: false
                    geodesic: false
                    visible: true
                , (defaultValue, key) ->
                    if angular.isUndefined(scope[key]) or scope[key] is null
                        opts[key] = defaultValue
                    else
                        opts[key] = scope[key]
                opts
]