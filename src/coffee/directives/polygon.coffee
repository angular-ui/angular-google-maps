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
Rick Huizinga - https://plus.google.com/+RickHuizinga
###
angular.module("google-maps")
.directive "polygon", ["$log", "$timeout", "array-sync", "GmapUtil", ($log, $timeout, arraySync, GmapUtil) ->
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
    restrict: "EA"
    replace: true
    require: "^googleMap"
    scope:
        path: "=path"
        stroke: "=stroke"
        clickable: "="
        draggable: "="
        editable: "="
        geodesic: "="
        fill: "="
        icons: "=icons"
        visible: "="
        static: "="
        events: "="
        zIndex: "=zindex"
        fit: "="

    link: (scope, element, attrs, mapCtrl) ->

        # Validate required properties
        if angular.isUndefined(scope.path) or scope.path is null or not GmapUtil.validatePath(scope.path)
            $log.error "polygon: no valid path attribute found"
            return

        # Wrap polygon initialization inside a $timeout() call to make sure the map is created already
        mapCtrl.getScope().deferred.promise.then (map) =>
            buildOpts = (pathPoints) ->
                opts = angular.extend({}, DEFAULTS,
                    map: map
                    path: pathPoints
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
                    geodesic: false
                    visible: true
                    static: false
                    fit: false
                    zIndex: 0
                , (defaultValue, key) ->
                    if angular.isUndefined(scope[key]) or scope[key] is null
                        opts[key] = defaultValue
                    else
                        opts[key] = scope[key]

                opts.editable = false if opts.static
                opts
            
            pathPoints = GmapUtil.convertPathPoints(scope.path)
            polygon = new google.maps.Polygon(buildOpts(pathPoints))
            GmapUtil.extendMapBounds map, pathPoints  if scope.fit
            
            if !scope.static and angular.isDefined(scope.editable)
                scope.$watch "editable", (newValue, oldValue) ->
                    polygon.setEditable newValue if newValue != oldValue

            if angular.isDefined(scope.draggable)
                scope.$watch "draggable", (newValue, oldValue) ->
                    polygon.setDraggable newValue if newValue != oldValue

            if angular.isDefined(scope.visible)
                scope.$watch "visible", (newValue, oldValue) ->
                    polygon.setVisible newValue if newValue != oldValue

            if angular.isDefined(scope.geodesic)
                scope.$watch "geodesic", (newValue, oldValue) ->
                    polygon.setOptions buildOpts(polygon.getPath()) if newValue != oldValue

            if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.opacity)
                scope.$watch "stroke.opacity", (newValue, oldValue) ->
                    polygon.setOptions buildOpts(polygon.getPath())

            if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.weight)
                scope.$watch "stroke.weight", (newValue, oldValue) ->
                    polygon.setOptions buildOpts(polygon.getPath()) if newValue != oldValue

            if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.color)
                scope.$watch "stroke.color", (newValue, oldValue) ->
                    polygon.setOptions buildOpts(polygon.getPath()) if newValue != oldValue
                    
            if angular.isDefined(scope.fill) and angular.isDefined(scope.fill.color)
                scope.$watch "fill.color", (newValue, oldValue) ->
                    polygon.setOptions buildOpts(polygon.getPath()) if newValue != oldValue

            if angular.isDefined(scope.fill) and angular.isDefined(scope.fill.opacity)
                scope.$watch "fill.opacity", (newValue, oldValue) ->
                    polygon.setOptions buildOpts(polygon.getPath()) if newValue != oldValue

            if angular.isDefined(scope.zIndex)
                scope.$watch "zIndex", (newValue, oldValue) ->
                    polygon.setOptions buildOpts(polygon.getPath()) if newValue != oldValue
            
            if angular.isDefined(scope.events) and scope.events isnt null and angular.isObject(scope.events)
                getEventHandler = (eventName) ->
                    ->
                        scope.events[eventName].apply scope, [polygon, eventName, arguments]

                #TODO: Need to keep track of listeners and call removeListener on each
                for eventName of scope.events
                    polygon.addListener eventName, getEventHandler(eventName)  if scope.events.hasOwnProperty(eventName) and angular.isFunction(scope.events[eventName])
                    
            arraySyncer = arraySync polygon.getPath(), scope, "path", (pathPoints) ->
              GmapUtil.extendMapBounds map, pathPoints  if scope.fit

            # Remove polygon on scope $destroy
            scope.$on "$destroy", ->
                polygon.setMap null
                if arraySyncer
                    arraySyncer()
                    arraySyncer = null
]
