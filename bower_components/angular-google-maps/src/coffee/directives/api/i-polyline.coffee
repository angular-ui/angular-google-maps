angular.module("google-maps.directives.api")
.factory "IPolyline", ["GmapUtil", "BaseObject", "Logger", 'CtrlHandle', (GmapUtil, BaseObject, Logger, CtrlHandle) ->
  class IPolyline extends BaseObject
    @include GmapUtil
    @extend CtrlHandle
    constructor: ()->
    restrict: "EA"
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
      events: "="

    DEFAULTS: {}
    $log: Logger
]