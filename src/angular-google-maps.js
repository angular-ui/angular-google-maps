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

(function () {
	
	"use strict";
	
	/* 
	 * Create the model in a self-contained class where map-specific logic is 
	 * done. This model will be used in the directive.
	 */
	
	var MapModel = (function () {
		
		var _defaults = { 
				zoom: 8,
				draggable: false,
				container: null
			};
		
		/**
		 * 
		 */
		function PrivateMapModel(opts) {
			
			var _instance = null,
				_markers = [],	// caches the instances of google.maps.Marker
				_handlers = [], // event handlers
				_windows = [],  // InfoWindow objects
				o = angular.extend({}, _defaults, opts),
				that = this;
			
			this.center = opts.center;
			this.zoom = o.zoom;
			this.draggable = o.draggable;
			this.dragging = false;
			this.selector = o.container;
			this.markers = [];
			
			this.draw = function () {
				
				if (that.center == null) {
					// TODO log error
					return;
				}
				
				if (_instance == null) {
					
					// Create a new map instance
					
					_instance = new google.maps.Map(that.selector, {
						center: that.center,
						zoom: that.zoom,
						draggable: that.draggable,
						mapTypeId : google.maps.MapTypeId.ROADMAP
					});
					
					google.maps.event.addListener(_instance, "dragstart",
							
							function () {
								that.dragging = true;
							}
					);
					
					google.maps.event.addListener(_instance, "dragend",
							
							function () {
								that.dragging = false;
							}
					);
					
					google.maps.event.addListener(_instance, "drag",
							
							function () {				
								that.center = _instance.getBounds().getCenter();		
							}
					);	
					
					google.maps.event.addListener(_instance, "zoom_changed",
							
							function () {
								that.zoom = _instance.getZoom();
							}
					);
					
					google.maps.event.addListener(_instance, "center_changed",
							
							function () {
								that.center = _instance.getCenter();
							}
					);
					
					// Attach additional event listeners if needed
					if (_handlers.length) {
						
						angular.forEach(_handlers, function (h, i) {
							
							google.maps.event.addListener(_instance, 
									h.on, h.handler);
						});
					}
				}
				else {
					
					// Refresh the existing instance					
					_instance.setCenter(that.center);
					_instance.setZoom(that.zoom);
					google.maps.event.trigger(_instance, "resize");
				}
				
				// TODO is this really needed to open each info windows?
				angular.forEach(_windows, function (w, i) {
					w.open(_instance);
				});
			};
			
			this.fit = function () {
				if (_instance && _markers.length) {
					
					var bounds = new google.maps.LatLngBounds();
					
					angular.forEach(_markers, function (m, i) {
						bounds.extend(m.getPosition());
					});
					
					_instance.fitBounds(bounds);
				}
			};
			
			this.on = function(event, handler) {
				_handlers.push({
					"on": event,
					"handler": handler
				});
			};
			
			this.addMarker = function (lat, lng, label, url, 
					thumbnail) {
				
				if (that.findMarker(lat, lng) != null) {
					return;
				}
				
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat, lng),
					map: _instance
				});
				
				if (label) {
					
				}
				
				if (url) {
					
				}
				
				// Cache marker 
				_markers.unshift(marker);
				
				// Cache instance of our marker for scope purposes
				that.markers.unshift({
					"lat": lat,
					"lng": lng,
					"draggable": false,
					"label": label,
					"url": url,
					"thumbnail": thumbnail
				});
				
				// Return marker instance
				return marker;
			};
			
			this.findMarker = function (lat, lng) {
				for (var i = 0; i < _markers.length; i++) {
					var pos = _markers[i].getPosition();
					
					if (pos.lat() == lat && pos.lng() == lng) {
						return _markers[i];
					}
				}
				
				return null;
			};	
			
			this.addInfoWindow = function (lat, lng, html) {
				var win = new google.maps.InfoWindow({
					content: html,
					position: new google.maps.LatLng(lat, lng)
				});
				
				_windows.push(win);
				
				return win;
			};
			
			this.hasMarker = function (lat, lng) {
				return that.findMarker(lat, lng) !== null;
			};	
		}
		
		// Done
		return PrivateMapModel;
	}());
	
	// End model
	
	// Start Angular directive
	
	var googleMapsModule = angular.module("google-maps", []);

	/**
	 * Map directive
	 */
	googleMapsModule.directive("googleMap", function ($log, $timeout, 
			$filter) {
		
		return {
			restrict: "EC",
			priority: 100,
			transclude: true,
			template: "<div class='angular-google-map' ng-transclude></div>",
			replace: false,
			scope: {
				center: "=center", // required
				markers: "=markers", // optional
				latitude: "=latitude", // required
				longitude: "=longitude", // required
				zoom: "=zoom", // optional, default 8
				refresh: "&refresh", // optional
				windows: "=windows" // optional
			},
			controller: function ($scope, $element) {
				
				this.addInfoWindow = function (lat, lng, content) {
					$scope.map.addInfoWindow(lat, lng, content);
				};
			},			
			link: function (scope, element, attrs, ctrl) {
				
				// Center property must be specified and provide lat & 
				// lng properties
				if (!angular.isDefined(scope.center) || 
						(!angular.isDefined(scope.center.lat) || 
								!angular.isDefined(scope.center.lng))) {
					
					$log.error("Could not find a valid center property");
					
					return;
				}
				
				// Create our model
				scope.map = new MapModel({
					container: angular.element(element)
						.addClass("angular-google-map"),
						
					center: new google.maps.LatLng(scope.center.lat, 
									scope.center.lng),
							
					draggable: attrs.draggable == "true",
					
					zoom: scope.zoom
				});
			
				scope.map.on("drag", function () {
					var c = scope.map.center;
				
					$timeout(function () {
						scope.$apply(function (s) {
							s.center.lat = c.lat();
							s.center.lng = c.lng();
						});
					});
				});
			
				scope.map.on("zoom_changed", function () {					
					$timeout(function () {
						scope.$apply(function (s) {
								s.zoom = scope.map.zoom;
						});
					});
				});
			
				scope.map.on("center_changed", function () {
					var c = scope.map.center;
				
					$timeout(function () {	
						scope.$apply(function (s) {
							if (!s.map.dragging) {
								s.center.lat = c.lat();
								s.center.lng = c.lng();
							}
						});
					});
				});
				
				if (attrs.markClick) {
					(function () {
						var cm = null;
						
						scope.map.on("click", function (e) {													
							if (cm == null) {
								cm = scope.map.addMarker(e.latLng.lat(), 
										e.latLng.lng());
								
								scope.markers.push({
									latitude: e.latLng.lat(),
									longitude: e.latLng.lng()
								});
							}
							else {
								// Find our marker in the scope
								var cm_position = cm.getPosition(),
									cm_lat = cm_position.lat(),
									cm_lng = cm_position.lng(),								
									filtered_markers = $filter("filter")(
											scope.markers, 
											function (m) {
												
												return m.latitude == cm_lat &&
													m.longitude == cm_lng;								
											}
									);
								
								// Update the marker position on the map
								cm.setPosition(e.latLng);
								
								// Update position of marker in scope too
								if (filtered_markers.length) {
									angular.extend(filtered_markers[0], {
										latitude: e.latLng.lat(),
										longitude: e.latLng.lng()
									});									
								}
							}
							
							$timeout(function () {
								scope.$apply();
							});
						});
					}());
				}
				
				// Check if we need to refresh the map
				scope.$watch("refresh()", function (newValue, oldValue) {
					if (newValue) {
						scope.map.draw();
					}
				});	
				
				// Markers
				scope.$watch("markers", function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}
					
					angular.forEach(newValue, function (v, i) {
						if (!scope.map.hasMarker(v.latitude, v.longitude)) {
							scope.map.addMarker(v.latitude, v.longitude);
						}
					});
					
					// Fit map when there are more than one marker. 
					// This will change the map center coordinates
					if (newValue.length > 1) {
						scope.map.fit();
					}
				}, true);
				
				
				// Update map when center coordinates change
				scope.$watch("center", function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}
					
					if (!scope.map.dragging) {
						scope.map.center = new google.maps.LatLng(newValue.lat, 
								newValue.lng);					
						scope.map.draw();
					}
				}, true);
				
				scope.$watch("zoom", function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}
					
					scope.map.zoom = newValue;
					scope.map.draw();
				});
			},
		};
	});
	
	/**
	 * Rectangle directive
	 */
	googleMapsModule.directive("infoWindow", function ($log, $timeout, 
			$compile, $controller) {
		
		return {
			restrict: 'E',
			require: '^googleMap',
			transclude: true,
			template: "<div class='angular-google-maps-info-window' " +
					"ng-transclude></div>",
			priority: 150,
			replace: false,
			compile: function (el, att, linker) {
				
				return function (scope, element, attrs, ctrl) {				
					$timeout(function () {
						ctrl.addInfoWindow(parseFloat(attrs.lat), 
								parseFloat(attrs.lng), linker(scope));
					});
					
				};
			}
		};
	});
	
}());