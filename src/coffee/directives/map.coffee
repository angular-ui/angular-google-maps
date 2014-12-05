###
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
Nick Baugh - https://github.com/niftylettuce
###

#jshint indent:4

#globals directives,google
angular.module("uiGmapgoogle-maps")
.directive "uiGmapGoogleMap", ["uiGmapMap", (Map) ->
  new Map()
]
