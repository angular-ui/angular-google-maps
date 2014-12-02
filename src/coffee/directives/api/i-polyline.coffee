angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapIPolyline', [
  'uiGmapGmapUtil', 'uiGmapBaseObject', 'uiGmapLogger', 'uiGmapCtrlHandle',
  (GmapUtil, BaseObject, Logger, CtrlHandle) ->
    class IPolyline extends BaseObject
      @include GmapUtil
      @extend CtrlHandle
      constructor: ()->
      restrict: 'EMA'
      replace: true
      require: '^' + 'uiGmapGoogleMap'
      scope:
        path: '='
        stroke: '='
        clickable: '='
        draggable: '='
        editable: '='
        geodesic: '='
        icons: '='
        visible: '='
        static: '='
        fit: '='
        events: '='

      DEFAULTS: {}
      $log: Logger
]
