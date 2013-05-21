(function () {
	
	var module = angular.module("google-maps-demo", ["google-maps", "bootstrap"]);
	
	module.config(function ($locationProvider) {
		$locationProvider.html5Mode(false).hashPrefix('!');
	});
	
	module.run(function ($rootScope, $location) {
		$rootScope.activeTab = 'usage';
		$location.path("usage");
		
		// New look for Google Maps
		google.maps.visualRefresh = true;
	});
	
	module.directive("callToAction", function () {
		return {
			restrict: "EC",
			transclude: true,
			replace: true,
			template: "<a class='btn' ng-click='track()' ng-transclude></a>",
			link: function (scope, element, attrs, ctrl) {
				scope.track = function () {
					if (_gaq) {
						_gaq.push(["_trackEvent", attrs.category, angular.element(element).text()]);
					}
				};
			}
		};
	});
	
	module.controller("DemoController", function ($scope, $location) {
				
		$scope.$watch("activeTab", function (newValue, oldValue) {
			if (newValue === oldValue) {
				return;
			}
			
			if ($location.path() != $scope.activeTab) {
				$location.path($scope.activeTab);
			}
		});
		
		$scope.getNavClass = function (item) {
			return item == $scope.activeTab ? "active" : "";
		};
		
		// default location
		$scope.center = {
			latitude: 45,
			longitude: -73
		};
		
		$scope.geolocationAvailable = navigator.geolocation ? true : false;
		
		$scope.latitude = null;
		$scope.longitude = null;
		
		$scope.zoom = 4;
		
		$scope.markers = [];
		
		$scope.markerLat = null;
		$scope.markerLng = null;
		
		$scope.addMarker = function () {
			$scope.markers.push({
				latitude: parseFloat($scope.markerLat),
				longitude: parseFloat($scope.markerLng)
			});
			
			$scope.markerLat = null;
			$scope.markerLng = null;
		};
		
		$scope.findMe = function () {
			
			if ($scope.geolocationAvailable) {
				
				navigator.geolocation.getCurrentPosition(function (position) {
					
					$scope.center = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					};
					
					$scope.$apply();
				}, function () {
					
				});
			}	
		};
	});
}());
