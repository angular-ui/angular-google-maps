###
angular-google-maps
https://github.com/nlaplante/angular-google-maps

@authors
Nicholas McCready - https://twitter.com/nmccready

# Brunt of the work is in DrawFreeHandChildModel
###
angular.module('google-maps'.ns()).directive 'FreeDrawPolygons'.ns(), ['ApiFreeDrawPolygons'.ns(),(FreeDrawPolygons) ->
  new FreeDrawPolygons()
]
