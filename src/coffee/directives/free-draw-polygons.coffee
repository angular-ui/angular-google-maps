###
angular-google-maps
https://github.com/nlaplante/angular-google-maps

@authors
Nicholas McCready - https://twitter.com/nmccready

# Brunt of the work is in DrawFreeHandChildModel
###
angular.module('google-maps').directive 'ngmapFreeDrawPolygons', ['FreeDrawPolygons',(FreeDrawPolygons) ->
  new FreeDrawPolygons()
]
