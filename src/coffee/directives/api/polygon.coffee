angular.module("google-maps.directives.api".ns())
.factory "Polygon".ns(), ["IPolygon".ns(), "$timeout", "array-sync".ns(), "PolygonChildModel".ns()
  (IPolygon, $timeout, arraySync, PolygonChild) ->
    class Polygon extends IPolygon
      link: (scope, element, attrs, mapCtrl) =>
        children = []
        promise = IPolygon.mapPromise(scope, mapCtrl)
        if scope.control?
          scope.control.getInstance = @
          scope.control.polygons = children
          scope.control.promise = promise

        promise.then (map) =>
          children.push new PolygonChild scope, attrs, map, @DEFAULTS
]