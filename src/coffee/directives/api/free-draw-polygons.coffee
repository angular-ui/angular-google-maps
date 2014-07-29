###
  - Link up Polygons to be sent back to a controller
  - inject the draw function into a controllers scope so that controller can call the directive to draw on demand
  - draw function creates the DrawFreeHandChildModel which manages itself
###
angular.module("google-maps.directives.api")
.factory 'FreeDrawPolygons', ['Logger', 'BaseObject', 'CtrlHandle', 'DrawFreeHandChildModel',($log, BaseObject, CtrlHandle, DrawFreeHandChildModel) ->
    class FreeDrawPolygons extends BaseObject
      @include CtrlHandle
      restrict: 'EA'
      replace: true
      require: '^googleMap'
      scope:
        polygons: '='
        draw: '='

      link: (scope, element, attrs, ctrl) =>
        @mapPromise(scope, ctrl).then (map) =>
          return $log.error "No polygons to bind to!" unless scope.polygons
          return $log.error "Free Draw Polygons must be of type Array!" unless _.isArray scope.polygons
          freeHand = new DrawFreeHandChildModel(map, scope.polygons,scope.originalMapOpts)
          scope.draw = () ->
            freeHand.engage()
]