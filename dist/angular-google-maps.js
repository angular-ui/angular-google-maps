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

angular.module('google-maps', []);;/**!
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
    .directive('googleMap', ['$log', '$timeout', '$filter', function ($log, $timeout, $filter) {

        "use strict";

        /*
         * Utility functions
         */

        /**
         * Check if 2 floating point numbers are equal
         *
         * @see http://stackoverflow.com/a/588014
         */
        function floatEqual(f1, f2) {
            return (Math.abs(f1 - f2) < 0.000001);
        }

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
            /**
             *
             */
            restrict: 'ECMA',

            /**
             *
             */
            transclude: true,

            /**
             *
             */
            replace: false,

            /**
             *
             */
            //priority: 100,

            /**
             *
             */
            template: '<div class="angular-google-map"><div class="angular-google-map-container"></div><div ng-transclude style="display: none"></div></div>',

            /**
             *
             */
            scope: {
                center: '=center',          // required
                zoom: '=zoom',              // required
                latitude: '=latitude',      // required
                longitude: '=longitude',    // required
                markers: '=markers',        // optional
                refresh: '&refresh',        // optional
                windows: '=windows',        // optional
                events: '=events'
            },

            /**
             *
             */
            controller: ['$scope', function ($scope) {
                /**
                 * @return the map instance
                 */
                this.getMap = function () {
                    return $scope.map;
                };
            }],

            /**
             *
             * @param scope
             * @param element
             * @param attrs
             * @param ctrl
             * @returns
             */
            link: function (scope, element, attrs, ctrl) {

                // Center property must be specified and provide lat &
                // lng properties
                if (!angular.isDefined(scope.center) ||
                    (!angular.isDefined(scope.center.latitude) || !angular.isDefined(scope.center.longitude))) {

                    $log.error("angular-google-maps: could not find a valid center property");
                    return;
                }

                if (!angular.isDefined(scope.zoom)) {
                    $log.error("angular-google-maps: map zoom property not set");
                    return;
                }

                angular.element(element).addClass("angular-google-map");

                // Parse options
                var opts = {options: {}};
                if (attrs.options) {
                    opts.options = angular.fromJson(attrs.options);
                }

                // Create the map
                var _m = new google.maps.Map(element.find('div')[1], angular.extend(opts, {
                    center: new google.maps.LatLng(scope.center.latitude, scope.center.longitude),
                    draggable: isTrue(attrs.draggable),
                    zoom: scope.zoom,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }));

                var dragging = false;
                google.maps.event.addListener(_m, 'dragstart', function () {
                    dragging = true;
                });

                google.maps.event.addListener(_m, 'dragend', function () {
                    dragging = false;
                });

                google.maps.event.addListener(_m, 'drag', function () {
                    var c = _m.center;

                    $timeout(function () {
                        scope.$apply(function (s) {
                            scope.center.latitude = c.lat();
                            scope.center.longitude = c.lng();
                        });
                    });
                });

                google.maps.event.addListener(_m, 'zoom_changed', function () {
                    if (scope.zoom != _m.zoom) {

                        $timeout(function () {
                            scope.$apply(function (s) {
                                scope.zoom = _m.zoom;
                            });
                        });
                    }
                });

                google.maps.event.addListener(_m, 'center_changed', function () {
                    var c = _m.center;

                    $timeout(function () {
                        scope.$apply(function (s) {
                            if (!_m.dragging) {
                                scope.center.latitude = c.lat();
                                scope.center.longitude = c.lng();
                            }
                        });
                    });
                });

                if (angular.isDefined(scope.events) &&
                    scope.events !== null &&
                    angular.isObject(scope.events)) {

                    var getEventHandler = function (eventName) {
                        return function () {
                            scope.events[eventName].apply(scope, [_m, eventName, arguments ]);
                        };
                    };

                    for (var eventName in scope.events) {

                        if (scope.events.hasOwnProperty(eventName) && angular.isFunction(scope.events[eventName])) {

                            google.maps.event.addListener(_m, eventName, getEventHandler(eventName));
                        }
                    }
                }

                if (isTrue(attrs.markClick)) {

                    var cm = null;

                    google.maps.event.addListener(_m, 'click', function (e) {

                        if (cm === null) {

                            cm = {
                                latitude: e.latLng.lat(),
                                longitude: e.latLng.lng()
                            };

                            scope.markers.push(cm);
                        }
                        else {
                            cm.latitude = e.latLng.lat();
                            cm.longitude = e.latLng.lng();
                        }


                        $timeout(function () {
                            scope.latitude = cm.latitude;
                            scope.longitude = cm.longitude;
                            scope.$apply();
                        });
                    });
                }

                // Put the map into the scope
                scope.map = _m;

                google.maps.event.trigger(_m, "resize");

                // Check if we need to refresh the map
                if (angular.isUndefined(scope.refresh())) {
                    // No refresh property given; draw the map immediately
                    //_m.draw();
                }
                else {
                    scope.$watch("refresh()", function (newValue, oldValue) {
                        if (newValue && !oldValue) {
                            //  _m.draw();
                            var coords = new google.maps.LatLng(newValue.latitude, newValue.longitude);

                            if (isTrue(attrs.pan)) {
                                _m.panTo(coords);
                            }
                            else {
                                _m.setCenter(coords);
                            }


                        }
                    });
                }

                // Update map when center coordinates change
                scope.$watch('center', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    if (!dragging) {

                        var coords = new google.maps.LatLng(newValue.latitude, newValue.longitude);

                        if (isTrue(attrs.pan)) {
                            _m.panTo(coords);
                        }
                        else {
                            _m.setCenter(coords);
                        }

                        //_m.draw();
                    }
                }, true);

                scope.$watch('zoom', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    _m.setZoom(newValue);

                    //_m.draw();
                });
            }
        };
    }]);
;/**!
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
                        visible: scope.coords.latitude !== null && scope.coords.longitude !== null
                    });

                    // Disable animations
                    if (angular.isDefined(attrs.animate) && isFalse(attrs.animate)) {
                        delete opts.animate;
                    }

                    var marker = new google.maps.Marker(opts);
                    element.data('instance', marker);

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
;/**!
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

        return {
            restrict: 'ECA',
            require: '^googleMap',
            scope: {},
            link: function (scope, element, attrs, mapCtrl) {
                var map = mapCtrl.getMap();
            }
        };
    }]);
;/**!
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
 * Map info window directive
 *
 * This directive is used to create an info window on an existing map.
 * This directive creates a new scope.
 *
 * {attribute coords required}  object containing latitude and longitude properties
 * {attribute show optional}    map will show when this expression returns true
 */

angular.module("google-maps").
    directive("window", ['$log', '$timeout','$compile', function ($log, $timeout, $compile) {

        "use strict";

        var DEFAULTS = {

        };

        return {
          restrict: 'ECMA',
          template: '<span class="angular-google-maps-window" ng-transclude></span>',
          transclude: true,
          priority: -100,
          require: ['^googleMap', '^?marker'],
          scope: {
            coords: '=coords',
            show: '&show'
          },
          link: function (scope, element, attrs, ctrls) {
              $timeout(function () {

                  var mapCtrl = ctrls[0],
                      markerCtrl = ctrls.length > 1 ? ctrls[1] : null;

                  var opts = angular.extend({}, DEFAULTS, {
                      content: element.html(),
                      position: angular.isDefined(markerCtrl) ? markerCtrl.getMarker().getPosition() :
                          new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude)
                  });

                  var win = new google.maps.InfoWindow(opts);

                  if (angular.isDefined(markerCtrl)) {
                      // Open window on click
                      var markerInstance = markerCtrl.getMarker();

                      markerInstance.setClickable(true);

                      // Show the window and hide the marker on click
                      var initialMarkerVisibility;
                      google.maps.event.addListener(markerInstance, 'click', function () {
                          win.setPosition(markerInstance.getPosition());
                          win.open(mapCtrl.getMap());

                          initialMarkerVisibility = markerInstance.getVisible();
                          markerInstance.setVisible(false);
                      });

                      // Set visibility of marker back to what it was before opening the window
                      google.maps.event.addListener(win, 'closeclick', function () {
                        markerInstance.setVisible(initialMarkerVisibility);
                      });
                  }

                  scope.$watch('show()', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (newValue) {
                            win.open(mapCtrl.getMap());
                        }
                        else {
                            win.close();
                        }
                    }
                  });
              }, 50);
          }
        };
    }]);
