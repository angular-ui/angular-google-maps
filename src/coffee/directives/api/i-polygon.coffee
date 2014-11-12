angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapIPolygon', ['uiGmapGmapUtil', 'uiGmapBaseObject', 'uiGmapLogger', 'uiGmapCtrlHandle',
  (GmapUtil, BaseObject, Logger, CtrlHandle) ->
    class IPolygon extends BaseObject
      @include GmapUtil
      @extend CtrlHandle
      constructor: ->
      restrict: 'EMA'
      replace: true
      require: '^' + 'uiGmapGoogleMap'
      scope:
        path: '=path'
        stroke: '=stroke'
        clickable: '='
        draggable: '='
        editable: '='
        geodesic: '='
        fill: '='
        icons: '=icons'
        visible: '='
        static: '='
        events: '='
        zIndex: '=zindex'
        fit: '='
        control:'=control'

      DEFAULTS: {}
      $log: Logger
]
