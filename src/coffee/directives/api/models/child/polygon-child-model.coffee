angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapPolygonChildModel', [
  'uiGmapBasePolyChildModel', 'uiGmapPolygonOptionsBuilder',
  (BaseGen, Builder) ->
    gFactory = (opts) ->
      new google.maps.Polygon opts

    base = new BaseGen(Builder, gFactory)
    return class PolygonChildModel extends base
]
