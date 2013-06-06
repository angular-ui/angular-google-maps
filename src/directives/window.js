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
