###
!
The MIT License

Copyright (c) 2010-2013 Google, Inc. http://angularjs.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

angular-google-maps
https://github.com/nlaplante/angular-google-maps

@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
Chentsu Lin - https://github.com/ChenTsuLin
###
angular.module("google-maps").directive "rectangle", ["$log", "$timeout", ($log, $timeout) ->
    validateBoundPoints = (bounds) ->
        return false  if angular.isUndefined(bounds.sw.latitude) or angular.isUndefined(bounds.sw.longitude) or angular.isUndefined(bounds.ne.latitude) or angular.isUndefined(bounds.ne.longitude)

        true
    convertBoundPoints = (bounds) ->
        result = new google.maps.LatLngBounds(new google.maps.LatLng(bounds.sw.latitude, bounds.sw.longitude), new google.maps.LatLng(bounds.ne.latitude, bounds.ne.longitude))

        result
    fitMapBounds = (map, bounds) ->
        map.fitBounds bounds

    #
    #         * Utility functions
    #

    ###
    Check if a value is true
    ###
    isTrue = (val) ->
        angular.isDefined(val) and val isnt null and val is true or val is "1" or val is "y" or val is "true"
    "use strict"
    DEFAULTS = {}
    restrict: "ECA"
    require: "^googleMap"
    replace: true
    scope:
        bounds: "=bounds"
        stroke: "=stroke"
        clickable: "="
        draggable: "="
        editable: "="
        visible: "="

    link: (scope, element, attrs, mapCtrl) ->

        # Validate required properties
        if angular.isUndefined(scope.bounds) or scope.bounds is null or angular.isUndefined(scope.bounds.sw) or scope.bounds.sw is null or angular.isUndefined(scope.bounds.ne) or scope.bounds.ne is null or not validateBoundPoints(scope.bounds)
            $log.error "rectangle: no valid bound attribute found"
            return

        # Wrap rectangle initialization inside a $timeout() call to make sure the map is created already
        $timeout ->
            map = mapCtrl.getMap()
            bounds = convertBoundPoints(scope.bounds)
            opts = angular.extend({}, DEFAULTS,
                map: map
                bounds: bounds
                strokeColor: scope.stroke and scope.stroke.color
                strokeOpacity: scope.stroke and scope.stroke.opacity
                strokeWeight: scope.stroke and scope.stroke.weight
            )
            angular.forEach
                clickable: true
                draggable: false
                editable: false
                visible: true
            , (defaultValue, key) ->
                if angular.isUndefined(scope[key]) or scope[key] is null
                    opts[key] = defaultValue
                else
                    opts[key] = scope[key]

            rectangle = new google.maps.Rectangle(opts)
            fitMapBounds map, bounds  if isTrue(attrs.fit)
            if angular.isDefined(scope.editable)
                scope.$watch "editable", (newValue, oldValue) ->
                    rectangle.setEditable newValue

            if angular.isDefined(scope.draggable)
                scope.$watch "draggable", (newValue, oldValue) ->
                    rectangle.setDraggable newValue

            if angular.isDefined(scope.visible)
                scope.$watch "visible", (newValue, oldValue) ->
                    rectangle.setVisible newValue

            # Remove rectangle on scope $destroy
            scope.$on "$destroy", ->
                rectangle.setMap null


]
