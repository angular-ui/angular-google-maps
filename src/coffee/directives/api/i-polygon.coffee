angular.module("google-maps.directives.api".ns())
.factory "IPolygon".ns(), ["GmapUtil".ns(), "BaseObject".ns(), "Logger".ns(), "CtrlHandle".ns(),
  (GmapUtil, BaseObject, Logger, CtrlHandle) ->
    class IPolygon extends BaseObject
      @include GmapUtil
      @extend CtrlHandle
      constructor: ->
      restrict: "EMA"
      replace: true
      require: '^' + 'GoogleMap'.ns()
      scope:
        path: "=path"
        stroke: "=stroke"
        clickable: "="
        draggable: "="
        editable: "="
        geodesic: "="
        fill: "="
        icons: "=icons"
        visible: "="
        static: "="
        events: "="
        zIndex: "=zindex"
        fit: "="
        control:"=control"

      DEFAULTS: {}
      $log: Logger
]