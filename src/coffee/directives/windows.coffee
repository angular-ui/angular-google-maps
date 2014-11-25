###
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
###

###
Map info window directive

This directive is used to create an info window on an existing map.
This directive creates a new scope.

{attribute coords required}  object containing latitude and longitude properties
{attribute show optional}    map will show when this expression returns true
###
angular.module("uiGmapgoogle-maps")
.directive "uiGmapWindows", ["$timeout", "$compile", "$http", "$templateCache", "$interpolate", "uiGmapWindows",
  ($timeout, $compile, $http, $templateCache, $interpolate, Windows) ->
    new Windows($timeout, $compile, $http, $templateCache, $interpolate)
]
