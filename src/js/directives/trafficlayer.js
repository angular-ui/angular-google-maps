/**!
 * The MIT License
 *
 * Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * angular-google-maps
 * https://github.com/nlaplante/angular-google-maps
 *
 * @authors: 
 *   - Nicolas Laplante https://plus.google.com/108189012221374960701
 *   - Nicholas McCready
 */

/**
 * Map TrafficLayer directive
 *
 * This directive is used to create a TrafficLayer on an existing map.
 * This directive creates a new scope.
 *
 * {attribute show optional}  true (default) shows the trafficlayer otherwise it is hidden
 */

angular.module('google-maps')
    .directive('trafficlayer', ['$log', '$timeout', function ($log, $timeout) {
        "use strict";
        return {
            restrict: 'ECMA',
            require: '^googleMap',
            priority: -1,
            transclude: true,
            template: '<span class="angular-google-map-trafficlayer" ng-transclude></span>',
            replace: true,
            scope: {
                show: '=show' //not required and will default to true
            },
            link: function (scope, element, attrs, mapCtrl) {
                var trafficLayer = new google.maps.TrafficLayer();
                var gMap;
                var doShow = true;
                // Wrap marker initialization inside a $timeout() call to make sure the map is created already
                $timeout(function () {
                    gMap = mapCtrl.getMap();
                    if (angular.isDefined(attrs.show))
                        doShow = scope.show;
                    if(doShow !== null && doShow && gMap !== null)                        
                        trafficLayer.setMap(gMap);

                    scope.$watch('show', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            doShow = newValue;
                            if (newValue)
                                trafficLayer.setMap(gMap);
                            else 
                                trafficLayer.setMap(null);
                            
                        }
                    }, true);

                    // remove marker on scope $destroy
                    scope.$on("$destroy", function () {
                        trafficLayer.setMap(null);
                    });
                });
            }
        };
    }]);
