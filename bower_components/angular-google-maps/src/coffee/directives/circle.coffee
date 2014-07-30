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

@authors
Julian Popescu - https://github.com/jpopesculian
Rick Huizinga - https://plus.google.com/+RickHuizinga
###
angular.module("google-maps")
.directive "circle", ["$log", "$timeout", "GmapUtil", "EventsHelper", ($log, $timeout, GmapUtil, EventsHelper) ->
    "use strict"
    DEFAULTS = {}
    restrict: "EA"
    replace: true
    require: "^googleMap"
    scope:
        center: "=center"
        radius: "=radius"
        stroke: "=stroke"
        fill: "=fill"
        clickable: "="
        draggable: "="
        editable: "="
        geodesic: "="
        icons: "=icons"
        visible: "="
        events: "="

    link: (scope, element, attrs, mapCtrl) ->

        # Wrap circle initialization inside a $timeout() call to make sure the map is created already
        mapCtrl.getScope().deferred.promise.then (map) =>
            buildOpts = ->
                # Validate required properties
                if !GmapUtil.validateCoords(scope.center)
                    $log.error "circle: no valid center attribute found"
                    return
                opts = angular.extend({}, DEFAULTS,
                    map: map
                    center: GmapUtil.getCoords(scope.center)
                    radius: scope.radius
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
                , (defaultValue, key) ->
                    if angular.isUndefined(scope[key]) or scope[key] is null
                        opts[key] = defaultValue
                    else
                        opts[key] = scope[key]

                opts

            circle = new google.maps.Circle(buildOpts())

            scope.$watchCollection 'center', (newVals, oldVals) ->
                if newVals isnt oldVals
                    circle.setOptions buildOpts()

            scope.$watchCollection 'stroke', (newVals, oldVals) ->
                if newVals isnt oldVals
                    circle.setOptions buildOpts() 

            scope.$watchCollection 'fill', (newVals, oldVals) ->
                if newVals isnt oldVals
                    circle.setOptions buildOpts() 

            scope.$watch 'radius', (newVal, oldVal) ->
                if newVal isnt oldVal
                    circle.setOptions buildOpts()

            scope.$watch 'clickable', (newVal, oldVal) ->
                if newVal isnt oldVal
                    circle.setOptions buildOpts()

            scope.$watch 'editable', (newVal, oldVal) ->
                if newVal isnt oldVal
                    circle.setOptions buildOpts()

            scope.$watch 'draggable', (newVal, oldVal) ->
                if newVal isnt oldVal
                    circle.setOptions buildOpts()

            scope.$watch 'visible', (newVal, oldVal) ->
                if newVal isnt oldVal
                    circle.setOptions buildOpts()

            scope.$watch 'geodesic', (newVal, oldVal) ->
                if newVal isnt oldVal
                    circle.setOptions buildOpts()
                    
            EventsHelper.setEvents circle, scope, scope

            google.maps.event.addListener circle, 'radius_changed', ->
                scope.radius = circle.getRadius()
                $timeout ->
                    scope.$apply()

            google.maps.event.addListener circle, 'center_changed', ->
                if angular.isDefined(scope.center.type)
                    scope.center.coordinates[1] = circle.getCenter().lat()
                    scope.center.coordinates[0] = circle.getCenter().lng()
                else
                    scope.center.latitude = circle.getCenter().lat()
                    scope.center.longitude = circle.getCenter().lng()
                    
                $timeout ->
                    scope.$apply()

            # Remove circle on scope $destroy
            scope.$on "$destroy", ->
                circle.setMap null

]