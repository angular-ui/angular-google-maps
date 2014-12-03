angular.module('uiGmapgoogle-maps.directives.api.options.builders')
.factory('uiGmapPolylineOptionsBuilder', [
  'uiGmapCommonOptionsBuilder'
  (CommonOptionsBuilder) ->
    class PolylineOptionsBuilder extends CommonOptionsBuilder
      buildOpts: (pathPoints) ->
        super {path: pathPoints},{geodesic: false}
])
.factory('uiGmapShapeOptionsBuilder', [
  'uiGmapCommonOptionsBuilder'
  (CommonOptionsBuilder) ->
    class ShapeOptionsBuilder extends CommonOptionsBuilder
      buildOpts: (customOpts,forEachOpts) ->
        model = if @hasModel then @scope.model else @scope #handle plurals
        fill = @scopeOrModelVal 'fill', @scope, model
        customOpts = angular.extend customOpts,
          fillColor: fill?.color
          fillOpacity: fill?.opacity
        super customOpts, forEachOpts
])
.factory('uiGmapPolygonOptionsBuilder', [
  'uiGmapShapeOptionsBuilder'
  (ShapeOptionsBuilder) ->
    class PolygonOptionsBuilder extends ShapeOptionsBuilder
      buildOpts: (pathPoints) ->
         super {path: pathPoints},{geodesic: false}
])
.factory('uiGmapRectangleOptionsBuilder', [
  'uiGmapShapeOptionsBuilder'
  (ShapeOptionsBuilder) ->
    class RectangleOptionsBuilder extends ShapeOptionsBuilder
      buildOpts: (bounds) ->
         super bounds: bounds
])
.factory('uiGmapCircleOptionsBuilder', [
  'uiGmapShapeOptionsBuilder'
  (ShapeOptionsBuilder) ->
    class CircleOptionsBuilder extends ShapeOptionsBuilder
      buildOpts: (center, radius) ->
         super {center: center, radius: radius}
])
