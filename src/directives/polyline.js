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
 * @author Nicolas Laplante https://plus.google.com/108189012221374960701
 */

angular.module("google-maps")
    .directive("polyline", ['$log', '$timeout', function ($log, $timeout) {

        "use strict";

        var DEFAULTS = {

        };

        function validatePathPoints(path) {
            for (var i = 0; i < path.length; i++) {
              if (angular.isUndefined(path[i].latitude) ||
                  angular.isUndefined(path[i].longitude)) {
                  return false;
              }
            }

            return true;
        }

        function convertPathPoints(path) {
            var result = [];

            for (var i = 0; i < path.length; i++) {
                result.push(new google.maps.LatLng(path[i].latitude, path[i].longitude));
            }

            return result;
        }

        function extendMapBounds(map, points) {
            var bounds = new google.maps.LatLngBounds();

            for (var i = 0; i < points.length; i++) {
                bounds.extend(points[i]);
            }

            map.fitBounds(bounds);
        }

        /*
         * Utility functions
         */

        /**
         * Check if a value is true
         */
        function isTrue(val) {
            return angular.isDefined(val) &&
                val !== null &&
                val === true ||
                val === '1' ||
                val === 'y' ||
                val === 'true';
        }

        return {
            restrict: 'ECA',
            require: '^googleMap',
            scope: {
                path: '=path',
                stroke: '=stroke'
            },
            link: function (scope, element, attrs, mapCtrl) {
                // Validate required properties
                if (angular.isUndefined(scope.path) ||
                    scope.path === null ||
                    scope.path.length < 2 ||
                    !validatePathPoints(scope.path)) {

                    $log.error("polyline: no valid path attribute found");
                    return;
                }

                // Wrap polyline initialization inside a $timeout() call to make sure the map is created already
                $timeout(function () {
                    var map = mapCtrl.getMap();

                    var pathPoints = convertPathPoints(scope.path);

                    var opts = angular.extend({}, DEFAULTS, {
                        map: map,
                        path: pathPoints,
                        strokeColor: scope.stroke && scope.stroke.color,
                        strokeOpacity: scope.stroke && scope.stroke.opacity,
                        strokeWeight: scope.stroke && scope.stroke.weight
                    });

                    var polyline = new google.maps.Polyline(opts);

                    if (isTrue(attrs.fit)) {
                        extendMapBounds(map, pathPoints);
                    }

                    scope.$watch('path', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            if (newValue) {
                                var newPathPoints = convertPathPoints(newValue);

                                polyline.setMap(map);
                                polyline.setPath(newPathPoints);

                                if (isTrue(attrs.fit)) {
                                    extendMapBounds(map, newPathPoints);
                                }
                            }
                            else {
                                // Remove polyline
                                polyline.setMap(null);
                            }
                        }
                    }, true);

                    // Remove polyline on scope $destroy
                    scope.$on("$destroy", function () {
                        polyline.setMap(null);
                    });
                });
            }
        };
    }]);
