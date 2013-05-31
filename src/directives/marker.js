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

angular.module('google-maps')
    .directive('marker', ['$log', '$timeout', function ($log, $timeout) {

        "use strict";

        var DEFAULTS = {
            animation: google.maps.Animation.DROP
        };

        return {
            restrict: 'ECAM',
            require: '^googleMap',
            priority: -1,
            transclude: true,
            template: '<span class="angular-google-map-marker" ng-transclude></span>',
            replace: true,
            scope: {
                coords: '=coords',
                click: '&click'
            },
            link: function (scope, element, attrs, mapCtrl) {

                $timeout(function () {
                    var opts = angular.extend({}, DEFAULTS, {
                        position: new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude),
                        map: mapCtrl.getMap(),
                        visible: scope.coords.latitude !== null && scope.coords.longitude !== null
                    });

                    var marker = new google.maps.Marker(opts);

                    scope.$watch('coords', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            marker.setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude));
                            marker.setVisible(newValue.latitude !== null && newValue.longitude !== null);
                        }
                    }, true);

                    // remove marker on scope $destroy
                    scope.$on("$destroy", function () {
                        marker.setMap(null);
                    });
                });

            }
        };
    }]);
