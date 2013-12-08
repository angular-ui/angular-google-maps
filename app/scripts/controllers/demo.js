'use strict';

angular.module('angularGoogleMapsApp').controller('DemoCtrl', function ($scope) {
	
	$scope.tab = 'status';
	
	$scope.map = {
		center: {
			latitude: 40.47,	// NYC
			longitude: -73.85	// NYC
		},
		zoom: 8,
		markers: [{
				id: 0,
				latitude: 41,
				longitude: -75,
				title: 'Marker 1'
			}, {
				id: 1,
				latitude: 38,
				longitude: -67,
				title: 'Marker 2'				
			}]
	};
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			$scope.map.center = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			};
		});
	}
	
});
