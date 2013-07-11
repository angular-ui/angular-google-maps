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

/**
 * Map marker directive
 *
 * This directive is used to create a marker on an existing map.
 * This directive creates a new scope.
 *
 * {attribute coords required}  object containing latitude and longitude properties
 * {attribute icon optional}	string url to image used for marker icon
 * {attribute animate optional} if set to false, the marker won't be animated (on by default)
 */

angular.module('google-maps')
    .directive('marker', ['$log', '$timeout', function ($log, $timeout) {

        "use strict";

        var DEFAULTS = {
            // Animation is enabled by default
            animation: google.maps.Animation.DROP
        };

        /**
         * Check if a value is literally false
         * @param value the value to test
         * @returns {boolean} true if value is literally false, false otherwise
         */
        function isFalse(value) {
            return ['false', 'FALSE', 0, 'n', 'N', 'no', 'NO'].indexOf(value ) !== -1;
        }
        return {
            restrict: 'ECMA',
            require: '^googleMap',
            priority: -1,
            transclude: true,
            template: '<span class="angular-google-map-marker" ng-transclude></span>',
            replace: true,
            scope: {
                coords: '=coords',
                icon: '=icon',
                click: '&click'
            },
            controller: function ($scope, $element) {
             this.getMarker = function () {
                 return $element.data('instance');
             };
            },
            link: function (scope, element, attrs, mapCtrl) {

                // Validate required properties
                if (angular.isUndefined(scope.coords) ||
                    scope.coords === null ||
                    angular.isUndefined(scope.coords.latitude) ||
                    angular.isUndefined(scope.coords.longitude)) {

                    $log.error("marker: no valid coords attribute found");
                    return;
                }

                // Wrap marker initialization inside a $timeout() call to make sure the map is created already
                $timeout(function () {
                    var opts = angular.extend({}, DEFAULTS, {
                        position: new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude),
                        map: mapCtrl.getMap(),
                        icon: scope.icon,
                        visible: scope.coords.latitude !== null && scope.coords.longitude !== null
                    });

                    // Disable animations
                    if (angular.isDefined(attrs.animate) && isFalse(attrs.animate)) {
                        delete opts.animation;
                    }

                    var marker = new google.maps.Marker(opts);
                    element.data('instance', marker);

                    google.maps.event.addListener(marker, 'click', function () {
                        if (angular.isDefined(attrs.click) && scope.click !== null)
                            scope.click();
                    });

                    scope.$watch('coords', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            if (newValue) {
                                marker.setMap(mapCtrl.getMap());
                                marker.setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude));
                                marker.setVisible(newValue.latitude !== null && newValue.longitude !== null);
                            }
                            else {
                                // Remove marker
                                marker.setMap(null);
                            }
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
