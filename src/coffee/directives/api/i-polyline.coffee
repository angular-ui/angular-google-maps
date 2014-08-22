angular.module("google-maps.directives.api".ns())
.factory "IPolyline".ns(), ["GmapUtil".ns(), "BaseObject".ns(), "Logger".ns(), "CtrlHandle".ns(), (GmapUtil, BaseObject, Logger, CtrlHandle) ->
  class IPolyline extends BaseObject
    @include GmapUtil
    @extend CtrlHandle
    constructor: ()->
    restrict: "EMA"
    replace: true
    require: '^' + 'GoogleMap'.ns()
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