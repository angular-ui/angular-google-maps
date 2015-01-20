angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapIPolyline', [
  'uiGmapGmapUtil', 'uiGmapBaseObject', 'uiGmapLogger', 'uiGmapCtrlHandle',
  (GmapUtil, BaseObject, Logger, CtrlHandle) ->
    class IPolyline extends BaseObject
      IPolyline.scope =
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
      IPolyline.scopeKeys = _.keys(IPolyline.scope)

      @include GmapUtil
      @extend CtrlHandle
      constructor: ->
      restrict: 'EMA'
      replace: true
      require: '^' + 'uiGmapGoogleMap'
      scope: IPolyline.scope

      DEFAULTS: {}
      $log: Logger
]
