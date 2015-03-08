angular.module('uiGmapgoogle-maps.directives.api.options.builders')
.factory('uiGmapPolylineOptionsBuilder', [
  'uiGmapCommonOptionsBuilder'
  (CommonOptionsBuilder) ->
    class PolylineOptionsBuilder extends CommonOptionsBuilder
      buildOpts: (pathPoints, cachedEval) ->
        super({path: pathPoints}, cachedEval, {geodesic: false})
])
.factory('uiGmapShapeOptionsBuilder', [
  'uiGmapCommonOptionsBuilder'
  (CommonOptionsBuilder) ->
    class ShapeOptionsBuilder extends CommonOptionsBuilder
      buildOpts: (customOpts, cachedEval, forEachOpts) ->
        model = @getCorrectModel(@scope)
        fill =  if cachedEval then cachedEval['fill'] else @scopeOrModelVal 'fill', @scope, model
        customOpts = angular.extend customOpts,
          fillColor: fill?.color
          fillOpacity: fill?.opacity
        super(customOpts, cachedEval, forEachOpts)
])
.factory('uiGmapPolygonOptionsBuilder', [
  'uiGmapShapeOptionsBuilder'
  (ShapeOptionsBuilder) ->
    class PolygonOptionsBuilder extends ShapeOptionsBuilder
      buildOpts: (pathPoints, cachedEval) ->
         super({path: pathPoints}, cachedEval, {geodesic: false})
])
.factory('uiGmapRectangleOptionsBuilder', [
  'uiGmapShapeOptionsBuilder'
  (ShapeOptionsBuilder) ->
    class RectangleOptionsBuilder extends ShapeOptionsBuilder
      buildOpts: (bounds, cachedEval) ->
         super(bounds: bounds, cachedEval)
])
.factory('uiGmapCircleOptionsBuilder', [
  'uiGmapShapeOptionsBuilder'
  (ShapeOptionsBuilder) ->
    class CircleOptionsBuilder extends ShapeOptionsBuilder
      buildOpts: (center, radius, cachedEval) ->
         super({center: center, radius: radius}, cachedEval)
])
