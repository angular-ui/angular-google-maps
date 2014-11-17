###
@authors
Nicholas McCready - https://twitter.com/nmccready
# Brunt of the work is in DrawFreeHandChildModel
###
angular.module('uiGmapgoogle-maps').directive 'uiGmapFreeDrawPolygons', [
  'uiGmapApiFreeDrawPolygons',(FreeDrawPolygons) ->
    new FreeDrawPolygons()
]
