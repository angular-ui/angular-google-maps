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
    function floatEqual (f1, f2) {
      return (Math.abs(f1 - f2) < 0.000001);
    }
    
    /**
     * Check if a value is true
     */
    function isTrue (val) {
      return angular.isDefined(val) &&
        val != null && 
        val === true || 
        val === '1' ||
        val === 'y' ||
        val === 'true';
    }
        
    return {
      /**
       * 
       */
      restrict: 'ECAM',
      
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
      template: '<div class="angular-google-map" ng-transclude><div class="angular-google-map-container"></div></div>',
      
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
            (!angular.isDefined(scope.center.latitude) || 
                !angular.isDefined(scope.center.longitude))) {
            
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
          mapTypeId : google.maps.MapTypeId.ROADMAP
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
            scope.events != null && 
            angular.isObject(scope.events)) {
          
          for (var eventName in scope.events) {
            
            if (scope.events.hasOwnProperty(eventName) && angular.isFunction(scope.events[eventName])) {
              
              google.maps.event.addListener(_m, eventName, function () {
                scope.events[eventName].apply(scope, [_m, eventName, arguments]);
              });
            }
          }
        }
        
        if (isTrue(attrs.markClick)) {          
          
          var cm = null;
          
          google.maps.event.addListener(_m, 'click', function (e) {            
            
            if (cm == null) {
              
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
        
        // Markers
        /*
        scope.$watch("markers", function (newValue, oldValue) {
          
          if (!angular.isArray(newValue)) {
            return;
          }
          
          $timeout(function () {
            
            angular.forEach(newValue, function (v, i) {
              if (!_m.hasMarker(v.latitude, v.longitude)) {
                _m.addMarker(v.latitude, v.longitude, v.icon, v.infoWindow);
              }
            });
            
            // Clear orphaned markers
            var orphaned = [];
            
            angular.forEach(_m.getMarkerInstances(), function (v, i) {
              // Check our scope if a marker with equal latitude and longitude. 
              // If not found, then that marker has been removed form the scope.
              
              var pos = v.getPosition(),
                lat = pos.lat(),
                lng = pos.lng(),
                found = false;
              
              // Test against each marker in the scope
              for (var si = 0; si < scope.markers.length; si++) {
                
                var sm = scope.markers[si];
                
                if (floatEqual(sm.latitude, lat) && floatEqual(sm.longitude, lng)) {
                  // Map marker is present in scope too, don't remove
                  found = true;
                }
              }
              
              // Marker in map has not been found in scope. Remove.
              if (!found) {
                orphaned.push(v);
              }
            });
  
            orphaned.length && _m.removeMarkers(orphaned);           
            
            // Fit map when there are more than one marker. 
            // This will change the map center coordinates
            if (attrs.fit == "true" && newValue && newValue.length > 1) {
              _m.fit();
            }
          });
          
        }, true);
        */
        
        
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
