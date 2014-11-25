###
@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
###

###
Map marker directive

This directive is used to create a marker on an existing map.
This directive creates a new scope.

{attribute coords required}  object containing latitude and longitude properties
{attribute icon optional}    string url to image used for marker icon
{attribute animate optional} if set to false, the marker won't be animated (on by default)
###
angular.module('uiGmapgoogle-maps')
.directive 'uiGmapMarkers', ['$timeout', 'uiGmapMarkers', ($timeout, Markers) ->
        new Markers($timeout)
    ]
