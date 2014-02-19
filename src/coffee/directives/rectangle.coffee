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
        bounds: "="
        stroke: "="
        clickable: "="
        draggable: "="
        editable: "="
        fill: "="
        visible: "="

    link: (scope, element, attrs, mapCtrl) ->

        # Validate required properties
        if angular.isUndefined(scope.bounds) or scope.bounds is null or angular.isUndefined(scope.bounds.sw) or scope.bounds.sw is null or angular.isUndefined(scope.bounds.ne) or scope.bounds.ne is null or not validateBoundPoints(scope.bounds)
            $log.error "rectangle: no valid bound attribute found"
            return

        # Wrap rectangle initialization inside a $timeout() call to make sure the map is created already
        $timeout ->
            buildOpts = (bounds) ->
                opts = angular.extend({}, DEFAULTS,
                    map: map
                    bounds: bounds
                    strokeColor: scope.stroke and scope.stroke.color
                    strokeOpacity: scope.stroke and scope.stroke.opacity
                    strokeWeight: scope.stroke and scope.stroke.weight
                    fillColor: scope.fill and scope.fill.color
                    fillOpacity: scope.fill and scope.fill.opacity
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

                opts
            map = mapCtrl.getMap()
            rectangle = new google.maps.Rectangle(buildOpts(convertBoundPoints(scope.bounds)))
            fitMapBounds map, bounds  if isTrue(attrs.fit)

            dragging = false
            google.maps.event.addListener rectangle, "mousedown", ->
                google.maps.event.addListener rectangle, "mousemove", ->
                    dragging = true
                    _.defer ->
                        scope.$apply (s) ->
                            s.dragging = dragging if s.dragging?

                google.maps.event.addListener rectangle, "mouseup", ->
                    google.maps.event.clearListeners(rectangle, 'mousemove');
                    google.maps.event.clearListeners(rectangle, 'mouseup');
                    dragging = false
                    _.defer ->
                        scope.$apply (s) ->
                            s.dragging = dragging if s.dragging?
                return

            settingBoundsFromScope = false
            google.maps.event.addListener rectangle , "bounds_changed", ->
                b = rectangle.getBounds()
                ne = b.getNorthEast()
                sw = b.getSouthWest()
                return  if settingBoundsFromScope #if the scope notified this change then there is no reason to update scope otherwise infinite loop
                _.defer ->
                    scope.$apply (s) ->
                        unless rectangle.dragging
                            if s.bounds isnt null and s.bounds isnt `undefined` and s.bounds isnt undefined
                                s.bounds.ne =
                                    latitude: ne.lat()
                                    longitude: ne.lng()

                                s.bounds.sw =
                                    latitude: sw.lat()
                                    longitude: sw.lng()
                        return

            # Update map when center coordinates change
            scope.$watch "bounds", ((newValue, oldValue) ->
                return  if _.isEqual(newValue, oldValue)
                settingBoundsFromScope = true
                unless dragging
                    if !newValue.sw.latitude? or !newValue.sw.longitude? or !newValue.ne.latitude? or !newValue.ne.longitude?
                        $log.error("Invalid bounds for newValue: #{JSON.stringify newValue}")
                    bounds = new google.maps.LatLngBounds(new google.maps.LatLng(newValue.sw.latitude, newValue.sw.longitude), new google.maps.LatLng(newValue.ne.latitude, newValue.ne.longitude))
                    rectangle.setBounds bounds

                settingBoundsFromScope = false
            ), true


            if angular.isDefined(scope.editable)
                scope.$watch "editable", (newValue, oldValue) ->
                    rectangle.setEditable newValue

            if angular.isDefined(scope.draggable)
                scope.$watch "draggable", (newValue, oldValue) ->
                    rectangle.setDraggable newValue

            if angular.isDefined(scope.visible)
                scope.$watch "visible", (newValue, oldValue) ->
                    rectangle.setVisible newValue

            if angular.isDefined(scope.stroke)
                if angular.isDefined(scope.stroke.color)
                    scope.$watch "stroke.color", (newValue, oldValue) ->
                        rectangle.setOptions buildOpts(rectangle.getBounds())

                if angular.isDefined(scope.stroke.weight)
                    scope.$watch "stroke.weight", (newValue, oldValue) ->
                        rectangle.setOptions buildOpts(rectangle.getBounds())

                if angular.isDefined(scope.stroke.opacity)
                    scope.$watch "stroke.opacity", (newValue, oldValue) ->
                        rectangle.setOptions buildOpts(rectangle.getBounds())

            if angular.isDefined(scope.fill)
                if angular.isDefined(scope.fill.color)
                    scope.$watch "fill.color", (newValue, oldValue) ->
                        rectangle.setOptions buildOpts(rectangle.getBounds())

                if angular.isDefined(scope.fill.opacity)
                    scope.$watch "fill.opacity", (newValue, oldValue) ->
                        rectangle.setOptions buildOpts(rectangle.getBounds())



            # Remove rectangle on scope $destroy
            scope.$on "$destroy", ->
                rectangle.setMap null


]
