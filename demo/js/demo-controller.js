function DemoController ($scope)
{
	$scope.center = {
		lat: 0,
		lng: 0
	};
	
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
}

(function () {
	angular.module("google-maps").run(function ($rootScope) {
		
		if (!navigator.geolocation) {
			$rootScope.center = {
				lat: 0,
				lng: 0
			};
			
			return;
		}
		
		navigator.geolocation.getCurrentPosition(function (position) {
			$rootScope.center = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
			}, 
			function (position) {
				$rootScope.center = {
					lat: 0,
					lng: 0
				};	
			}, {
			timeout: 10000,
			maximumAge: 60000
		});
	});
}());