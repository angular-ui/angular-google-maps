angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapPolylineChildModel', [
  'uiGmapBasePolyChildModel', 'uiGmapPolylineOptionsBuilder',
  (BaseGen, Builder) ->
    gFactory = (opts) ->
      new google.maps.Polyline opts

    base = BaseGen(Builder, gFactory)
    return class PolylineChildModel extends base
]
