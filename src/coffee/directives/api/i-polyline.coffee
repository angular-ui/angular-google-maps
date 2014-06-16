angular.module("google-maps.directives.api")
.factory "IPolyline", ["GmapUtil", "BaseObject", "Logger", (GmapUtil, BaseObject, Logger) ->
    class IPolyline extends BaseObject
        @include GmapUtil
        constructor: ()->
            self = @
        restrict: "ECA"
        replace: true
        require: "^googleMap"
        scope:
            path: "="
            stroke: "="
            clickable: "="
            draggable: "="
            editable: "="
            geodesic: "="
            icons: "="
            visible: "="
            static: "="
            fit: "="

        DEFAULTS: {}
        $log: Logger
]