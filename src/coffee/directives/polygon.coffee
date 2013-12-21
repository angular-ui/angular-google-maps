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
###
angular.module("google-maps").directive "polygon", ["$log", "$timeout", ($log, $timeout) ->
    validatePathPoints = (path) ->
        i = 0

        while i < path.length
            return false  if angular.isUndefined(path[i].latitude) or angular.isUndefined(path[i].longitude)
            i++
        true
    convertPathPoints = (path) ->
        result = new google.maps.MVCArray()
        i = 0

        while i < path.length
            result.push new google.maps.LatLng(path[i].latitude, path[i].longitude)
            i++
        result
    extendMapBounds = (map, points) ->
        bounds = new google.maps.LatLngBounds()
        i = 0

        while i < points.length
            bounds.extend points.getAt(i)
            i++
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
        path: "=path"
        stroke: "=stroke"
        clickable: "="
        draggable: "="
        editable: "="
        geodesic: "="
        icons: "=icons"
        visible: "="

    link: (scope, element, attrs, mapCtrl) ->

        # Validate required properties
        if angular.isUndefined(scope.path) or scope.path is null or scope.path.length < 2 or not validatePathPoints(scope.path)
            $log.error "polyline: no valid path attribute found"
            return

        # Wrap polyline initialization inside a $timeout() call to make sure the map is created already
        $timeout ->
            map = mapCtrl.getMap()
            pathPoints = convertPathPoints(scope.path)
            opts = angular.extend({}, DEFAULTS,
                map: map
                path: pathPoints
                strokeColor: scope.stroke and scope.stroke.color
                strokeOpacity: scope.stroke and scope.stroke.opacity
                strokeWeight: scope.stroke and scope.stroke.weight
            )
            angular.forEach
                clickable: true
                draggable: false
                editable: false
                geodesic: false
                visible: true
            , (defaultValue, key) ->
                if angular.isUndefined(scope[key]) or scope[key] is null
                    opts[key] = defaultValue
                else
                    opts[key] = scope[key]

            polyline = new google.maps.Polyline(opts)
            extendMapBounds map, pathPoints  if isTrue(attrs.fit)
            if angular.isDefined(scope.editable)
                scope.$watch "editable", (newValue, oldValue) ->
                    polyline.setEditable newValue

            if angular.isDefined(scope.draggable)
                scope.$watch "draggable", (newValue, oldValue) ->
                    polyline.setDraggable newValue

            if angular.isDefined(scope.visible)
                scope.$watch "visible", (newValue, oldValue) ->
                    polyline.setVisible newValue

            pathSetAtListener = undefined
            pathInsertAtListener = undefined
            pathRemoveAtListener = undefined
            polyPath = polyline.getPath()
            pathSetAtListener = google.maps.event.addListener(polyPath, "set_at", (index) ->
                value = polyPath.getAt(index)
                return  unless value
                return  if not value.lng or not value.lat
                scope.path[index].latitude = value.lat()
                scope.path[index].longitude = value.lng()
                scope.$apply()
            )
            pathInsertAtListener = google.maps.event.addListener(polyPath, "insert_at", (index) ->
                value = polyPath.getAt(index)
                return  unless value
                return  if not value.lng or not value.lat
                scope.path.splice index, 0,
                    latitude: value.lat()
                    longitude: value.lng()

                scope.$apply()
            )
            pathRemoveAtListener = google.maps.event.addListener(polyPath, "remove_at", (index) ->
                scope.path.splice index, 1
                scope.$apply()
            )
            scope.$watch "path", ((newArray) ->
                oldArray = polyline.getPath()
                if newArray isnt oldArray
                    if newArray
                        polyline.setMap map
                        i = 0
                        oldLength = oldArray.getLength()
                        newLength = newArray.length
                        l = Math.min(oldLength, newLength)
                        while i < l
                            oldValue = oldArray.getAt(i)
                            newValue = newArray[i]
                            oldArray.setAt i, new google.maps.LatLng(newValue.latitude, newValue.longitude)  if (oldValue.lat() isnt newValue.latitude) or (oldValue.lng() isnt newValue.longitude)
                            i++
                        while i < newLength
                            newValue = newArray[i]
                            oldArray.push new google.maps.LatLng(newValue.latitude, newValue.longitude)
                            i++
                        while i < oldLength
                            oldArray.pop()
                            i++
                        extendMapBounds map, oldArray  if isTrue(attrs.fit)
                    else

                        # Remove polyline
                        polyline.setMap null
            ), true

            # Remove polyline on scope $destroy
            scope.$on "$destroy", ->
                polyline.setMap null
                pathSetAtListener()
                pathSetAtListener = null
                pathInsertAtListener()
                pathInsertAtListener = null
                pathRemoveAtListener()
                pathRemoveAtListener = null


]