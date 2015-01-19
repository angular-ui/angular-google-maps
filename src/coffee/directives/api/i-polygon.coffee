angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapIPolygon', ['uiGmapGmapUtil', 'uiGmapBaseObject', 'uiGmapLogger', 'uiGmapCtrlHandle',
  (GmapUtil, BaseObject, Logger, CtrlHandle) ->

    class IPolygon extends BaseObject
      IPolygon.scope =
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
      IPolygon.scopeKeys = _.keys(IPolygon.scope)

      @include GmapUtil
      @extend CtrlHandle
      constructor: ->
      restrict: 'EMA'
      replace: true
      require: '^' + 'uiGmapGoogleMap'
      scope: IPolygon.scope

      DEFAULTS: {}
      $log: Logger
]
