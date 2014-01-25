'use strict';

angular.module('angularGoogleMapsApp')
  .controller('MainCtrl', function ($scope, $github, $log, analytics) {

	var DOWNLOAD_URL_TEMPLATE = 'https://raw.github.com/nlaplante/angular-google-maps/%REF%/dist/angular-google-maps.min.js',
		FALLBACK_BRANCH = 'master';
	
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
	
	$scope.dlClick = function () {
		analytics.trackEvent('click', 'download');
	};
	
	$github.getTags().then(function (data) {
		$scope.latestTag = data && data.length ? data[0] : {};
		$scope.downloadUrl = DOWNLOAD_URL_TEMPLATE.replace('%REF%', $scope.latestTag.name);
	}, function (e) {
	
		$log.error('could not fetch latest tag; falling back to ' + FALLBACK_BRANCH, e);
		
		$scope.latestTag = { name: FALLBACK_BRANCH };
		$scope.downloadUrl = DOWNLOAD_URL_TEMPLATE.replace('%REF%', FALLBACK_BRANCH);
	});
  });
