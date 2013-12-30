'use strict';

angular.module('angularGoogleMapsApp')
  .controller('MainCtrl', function ($scope) {

	$scope.map = {
		center: {
			latitude: 40.47,	// NYC
			longitude: -73.85	// NYC
		},
		zoom: 8
	};
	
	$scope.marker = {
		coords: {
			latitude: 40.47,
			longitude: -74.50
		}
	};
	
  });
