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
    .directive('googleMap', ['$log', '$timeout', function ($log, $timeout) {

        "use strict";

        var DEFAULTS = {
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

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
                dragging: '=dragging',      // optional
                markers: '=markers',        // optional
                refresh: '&refresh',        // optional
                windows: '=windows',        // optional
                events: '=events',           // optional
                bounds: '=bounds'
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
             */
            link: function (scope, element, attrs) {

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

                var el = angular.element(element);

                el.addClass("angular-google-map");

                // Parse options
                var opts = {options: {}};
                if (attrs.options) {
                    opts.options = angular.fromJson(attrs.options);
                }

                if (attrs.type) {
                    var type = attrs.type.toUpperCase();

                    if (google.maps.MapTypeId.hasOwnProperty(type)) {
                        opts.mapTypeId = google.maps.MapTypeId[attrs.type.toUpperCase()];
                    }
                    else {
                        $log.error('angular-google-maps: invalid map type "' + attrs.type + '"');
                    }
                }

                // Create the map
                var _m = new google.maps.Map(el.find('div')[1], angular.extend({}, DEFAULTS, opts, {
                    center: new google.maps.LatLng(scope.center.latitude, scope.center.longitude),
                    draggable: isTrue(attrs.draggable),
                    zoom: scope.zoom,
                    bounds: scope.bounds
                }));

                var dragging = false;

                google.maps.event.addListener(_m, 'dragstart', function () {
                    dragging = true;
                    $timeout(function () {
                        scope.$apply(function (s) {
                            s.dragging = dragging;
                        });
                    });
                });

                google.maps.event.addListener(_m, 'dragend', function () {
                    dragging = false;
                    $timeout(function () {
                        scope.$apply(function (s) {
                            s.dragging = dragging;
                        });
                    });
                });

                google.maps.event.addListener(_m, 'drag', function () {
                    var c = _m.center;

                    $timeout(function () {
                        scope.$apply(function (s) {
                            s.center.latitude = c.lat();
                            s.center.longitude = c.lng();
                        });
                    });
                });

                google.maps.event.addListener(_m, 'zoom_changed', function () {
                    if (scope.zoom != _m.zoom) {

                        $timeout(function () {
                            scope.$apply(function (s) {
                                s.zoom = _m.zoom;
                            });
                        });
                    }
                });
                var settingCenterFromScope = false;
                google.maps.event.addListener(_m, 'center_changed', function () {
                    var c = _m.center;

                    if(settingCenterFromScope) 
                        return; //if the scope notified this change then there is no reason to update scope otherwise infinite loop
                    $timeout(function () {
                        scope.$apply(function (s) {
                            if (!_m.dragging) {
                                if(s.center.latitude !== c.lat())
                                    s.center.latitude = c.lat();
                                if(s.center.longitude !== c.lng())
                                    s.center.longitude = c.lng();
                            }
                        });
                    });
                });

                google.maps.event.addListener(_m, 'idle', function () {
                    var b = _m.getBounds();
                    var ne = b.getNorthEast();
                    var sw = b.getSouthWest();

                    $timeout(function () {

                      scope.$apply(function (s) {

                        s.bounds.northeast = {latitude: ne.lat(), longitude: ne.lng()} ;
                        s.bounds.southwest = {latitude: sw.lat(), longitude: sw.lng()} ;
                        
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

                // Put the map into the scope
                scope.map = _m;

                google.maps.event.trigger(_m, "resize");

                // Check if we need to refresh the map
                if (!angular.isUndefined(scope.refresh())) {
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
                    settingCenterFromScope = true;
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
                    settingCenterFromScope = false;
                }, true);

                scope.$watch('zoom', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    _m.setZoom(newValue);

                    //_m.draw();
                });
				
				scope.$watch('bounds', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    var ne = new google.maps.LatLng(newValue.northeast.latitude, newValue.northeast.longitude);
                    var sw = new google.maps.LatLng(newValue.southwest.latitude, newValue.southwest.longitude);
                    var bounds = new google.maps.LatLngBounds(sw, ne);

                    _m.fitBounds(bounds);
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
                            $timeout(function() {
                                scope.click();
                            });
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

                    scope.$watch('icon', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            marker.icon = newValue;
                            marker.setMap(null);   
                            marker.setMap(mapCtrl.getMap());
                            marker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude));
                            marker.setVisible(scope.coords.latitude !== null && scope.coords.longitude !== null);
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
    directive("window", ['$log', '$timeout','$compile', '$http', '$templateCache', function ($log, $timeout, $compile, $http, $templateCache) {

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
            show: '&show',
            templateUrl: '=templateurl',
            templateParameter: '=templateparameter',
            isIconVisibleOnClick: '=isiconvisibleonclick',
            closeClick: '&closeclick'           //scope glue to gmap InfoWindow closeclick
          },
          link: function (scope, element, attrs, ctrls) {
              $timeout(function () {

                  var isIconVisibleOnClick = true;

                  if (angular.isDefined(attrs.isiconvisibleonclick)) 
                        isIconVisibleOnClick = scope.isIconVisibleOnClick;

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

                          markerInstance.setVisible(isIconVisibleOnClick);
                      });

                      // Set visibility of marker back to what it was before opening the window
                      google.maps.event.addListener(win, 'closeclick', function () {
                        markerInstance.setVisible(initialMarkerVisibility);
                        scope.closeClick();
                      });
                  }

                   function showWindow() {
                    if (scope.templateUrl) {
                        $http.get(scope.templateUrl, { cache: $templateCache })
                             .then(function (content) {
                                    var templateScope = scope.$new();
                                    if (angular.isDefined(scope.templateParameter)) {
                                        templateScope.parameter = scope.templateParameter;
                                    }
                                    var compiled = $compile(content.data)(templateScope);
                                    win.setContent(compiled.get(0));
                                    win.open(mapCtrl.getMap());
                              });
                    } else {
                        win.open(mapCtrl.getMap());
                    }
                  }

                  function hideWindow() {
                    win.close();
                  }

                  scope.$watch('show()', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (newValue) {
                            showWindow();
                        }
                        else {
                            hideWindow();
                        }
                    } else if (newValue && !win.getMap()) {
                        // If we're initially showing the marker and it's not yet visible, show it.
                        showWindow();
                    }
                  },true);
              }, 50);
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
