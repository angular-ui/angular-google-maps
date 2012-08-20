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
	
	var googleMapsModule = angular.module("google-maps", []);

	googleMapsModule.directive("googleMap", function ($log) {
		return {
			restrict: "EC",
			replace: true,
			transclude: true,
			scope: {
				center: "=center",
				markers: "=markers",
				latitude: "=latitude",
				longitude: "=longitude",
				zoom: "=zoom",
				refresh: "&refresh"
			},
			template: "<div class='angular-google-map' ng-transclude></div>",
			link: function (scope, element, attrs, ctrl) {
				
				var $el = angular.element(element).get(0),
				
					// Obtain a reference to the marker icon image
					markerImage = attrs.markerIcon ? new google.maps.MarkerImage(attrs.markerIcon) : null,
					
					// Center of the map
					center = new google.maps.LatLng(scope.center.lat, scope.center.lng),
				
					// Create the map instance
					map = new google.maps.Map($el, {
						backgroundColor: "#fff",
						"center": center,
						draggable: attrs.draggable == "true",
						zoom: angular.isNumber(scope.zoom) ? scope.zoom : 8,
						mapTypeId : google.maps.MapTypeId.ROADMAP
					}),
					
					/**
					 * Adds a marker to the map
					 * 
					 * @param marker object 
					 */
					addMarker = function (latitude, longitude, label, url) {
						var opts = {
							position: new google.maps.LatLng(latitude, longitude),
							"map": map,
							draggable: false,
						};
						
						if (markerImage) {
							optsicon = markerImage;
						}
						
						marker = new google.maps.Marker(opts);
						
						// Cache marker
						markerCache.push(marker);
						
						return marker;
					},
					
					markerCache = [],
					
					findMarkerInCache = function (lat, lng) {
						for (var i = 0; i < markerCache.length; i++) {
							var pos = markerCache[i].getPosition();
							
							if (pos.lat() == lat && pos.lng() == lng) {
								return markerCache[i];
							}
						}
						
						return null;
					};
				
				scope.refreshMarkers = function () {
					if (scope.markers && scope.markers.length) {			
						
						angular.forEach(scope.markers, function (marker) {
							var m = findMarkerInCache(marker.latitude, marker.longitude);
							
							if (!m) {
								addMarker(marker.latitude, marker.longitude, marker.label || null, marker.url || null);
							} else {
								m.setPosition(new google.maps.LatLng(marker.latitude, marker.longitude));
							}
						});
						
						// Check if we need to fitBounds()
						if (scope.markers && scope.markers.length > 1) {
							
							var bounds = new google.maps.LatLngBounds();
							
							angular.forEach(scope.markers, function (marker) {
								bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
							});
							
							map.fitBounds(bounds);
						}
					}
				};
				
				if (attrs.markCenter) {
					addMarker(center.lat(), center.lng());
				}
				
				if (attrs.markClick) {
					(function () {
						// Keep a reference to the click marker in the scope to update its position
						// when user clicks anywhere else
						var scopedClickMarker = null;
						
						google.maps.event.addListener(map, 'click', function (e) {

							if (scopedClickMarker) {
								// Click marker already present. Remove it to create a new one
								
								// We must find the real marker in our cache to set its map instance to null (remove it)
								var m = findMarkerInCache(scopedClickMarker.latitude, scopedClickMarker.longitude);
								
								if (m) {
									m.setMap(null);
									markerCache.splice(markerCache.indexOf(m), 1);
								}
								
								// Remove it from the scope's markers property too
								scope.markers.splice(scope.markers.indexOf(scopedClickMarker), 1);
								
								// Done
								scopedClickMarker = null;
							}
							
							// Add a new marker in our scope
							scopedClickMarker = {
								latitude: e.latLng.lat(),
								longitude: e.latLng.lng()
							};
							
							scope.markers.push(scopedClickMarker);
							
							// Set scope's latitude and longitude properties to the position
							// of the new marker
							scope.$apply(function (s) {
								s.latitude = e.latLng.lat();
								s.longitude = e.latLng.lng();
							});
						});
					}());
					
				}
				
				// Done!
				scope.map = map;
				
				// Listen for drags
				if (attrs.draggable == "true") {
					
					scope.dragging = false;
					
					google.maps.event.addListener(map, "dragstart", function (e) {
						scope.dragging = true;
					});
					
					google.maps.event.addListener(map, "dragend", function (e) {
						scope.dragging = false;
					});
					
					google.maps.event.addListener(map, "drag", function (e) {
						var c = map.getBounds().getCenter();
						
						scope.$apply(function (s) {
							s.center.lat = c.lat();
							s.center.lng = c.lng();
						});
					});
				}				
				
				// Watch for zoom
				google.maps.event.addListener(map, "zoom_changed", function (e) {					
					scope.zoom = map.getZoom();				
					scope.$apply();
				});
				
				scope.$watch("zoom", function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}
					
					if (angular.isNumber(scope.zoom)) {
						map.setZoom(scope.zoom);
					}
				});
				
				// Check if we need to refresh the map
				scope.$watch("refresh()", function (newValue, oldValue) {
					if (newValue) {
						google.maps.event.trigger(scope.map, "resize");
						
						// Need to reset center after refresh
						map.setCenter(center);
					}
				});
				
				// Watch for center change
				google.maps.event.addListener(map, "center_changed", function (e) {
					
					var c = map.getCenter();
					
					scope.center.lat = c.lat();
					scope.center.lng = c.lng();
				});				
				
				// Update map when center coordinates change
				scope.$watch("center", function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}
					
					if (!scope.dragging) {					
						if (angular.isNumber(newValue.lat) && angular.isNumber(newValue.lng)) {
							
							center = new google.maps.LatLng(newValue.lat, newValue.lng);
							
							scope.map.setCenter(center);					
							google.maps.event.trigger(scope.map, "resize");
						}
					}
				}, true);
				
				// Reset markers when changed in controller
				scope.$watch("markers", function (newValue, oldValue) {					
					scope.refreshMarkers();					
				}, true);
			}
		};
	});
	
}());