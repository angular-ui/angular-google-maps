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

###
Map info window directive

This directive is used to create an info window on an existing map.
This directive creates a new scope.

{attribute coords required}  object containing latitude and longitude properties
{attribute show optional}    map will show when this expression returns true
###
angular.module("google-maps")
.factory("Window", [ "IWindow", "GmapUtil", "WindowChildModel", (IWindow, GmapUtil, WindowChildModel) ->
        class Window extends IWindow
            @include GmapUtil
            constructor: ($timeout, $compile, $http, $templateCache) ->
                super($timeout, $compile, $http, $templateCache)
                self = @
                @require = ['^googleMap', '^?marker']
                @template = '<span class="angular-google-maps-window" ng-transclude></span>'
                @$log.info(self)

            link: (scope, element, attrs, ctrls) =>
                @$timeout(=>
                    isIconVisibleOnClick = true
                    if angular.isDefined(attrs.isiconvisibleonclick)
                        isIconVisibleOnClick = scope.isIconVisibleOnClick
                    mapCtrl = ctrls[0].getMap()
                    markerCtrl = if ctrls.length > 1 and ctrls[1]? then ctrls[1].getMarkerScope().gMarker else undefined
                    defaults = if scope.options? then scope.options else {}
                    hasScopeCoords = scope? and scope.coords? and scope.coords.latitude? and scope.coords.longitude?

                    opts =
                        if hasScopeCoords then @createWindowOptions(markerCtrl, scope, element.html(), defaults)
                        else undefined

                    if mapCtrl? #at the very least we need a Map, the marker is optional as we can create Windows without markers
                        window = new WindowChildModel(
                                {}, scope, opts, isIconVisibleOnClick, mapCtrl,
                                markerCtrl, @$http, @$templateCache, @$compile, element
                        )
                    scope.$on "$destroy", =>
                        window.destroy()

                    if ctrls[1]?
                        markerScope = ctrls[1].getMarkerScope()
                        markerScope.$watch 'coords', (newValue, oldValue) =>
                            return window.hideWindow() unless newValue?
                        markerScope.$watch 'coords.latitude', (newValue, oldValue) =>
                            if newValue != oldValue
                                window.getLatestPosition()

                    @onChildCreation(window) if @onChildCreation? and window?
                , GmapUtil.defaultDelay + 25)
        #return child for specs
        return Window
    ])
.directive("window",
            ["$timeout", "$compile", "$http", "$templateCache",
             "Window", ($timeout, $compile, $http, $templateCache, Window) ->
                new Window($timeout, $compile, $http, $templateCache)
            ])

