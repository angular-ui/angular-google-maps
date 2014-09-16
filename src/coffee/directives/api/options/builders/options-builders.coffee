angular.module("google-maps.directives.api.options.builders".ns())
.factory("PolylineOptionsBuilder".ns(), [
  "CommonOptionsBuilder".ns()
  (CommonOptionsBuilder) ->
    class PolylineOptionsBuilder extends CommonOptionsBuilder
      buildOpts: (pathPoints) ->
        super {path: pathPoints},{geodesic: false}
])
.factory("ShapeOptionsBuilder".ns(), [
  "CommonOptionsBuilder".ns()
  (CommonOptionsBuilder) ->
    class ShapeOptionsBuilder extends CommonOptionsBuilder
      buildOpts: (customOpts,forEachOpts) ->
        customOpts = angular.extend customOpts,
          {fillColor: @scope.fill?.color, fillOpacity: @scope.fill?.opacity}
        super customOpts, forEachOpts
])
.factory("PolygonOptionsBuilder".ns(), [
  "ShapeOptionsBuilder".ns()
  (ShapeOptionsBuilder) ->
    class PolygonOptionsBuilder extends ShapeOptionsBuilder
      buildOpts: (pathPoints) ->
         super {path: pathPoints},{geodesic: false}
])
.factory("RectangleOptionsBuilder".ns(), [
  "ShapeOptionsBuilder".ns()
  (ShapeOptionsBuilder) ->
    class RectangleOptionsBuilder extends ShapeOptionsBuilder
      buildOpts: (bounds) ->
         super bounds: bounds
])
.factory("CircleOptionsBuilder".ns(), [
  "ShapeOptionsBuilder".ns()
  (ShapeOptionsBuilder) ->
    class CircleOptionsBuilder extends ShapeOptionsBuilder
      buildOpts: (center, radius) ->
         super {center: center, radius: radius}
])
