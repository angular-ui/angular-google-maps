'use strict';

angular.module('angularGoogleMapsApp')
  .controller('HeadlinesCtrl', function ($scope, $http, $log, $timeout) {

	var fetchHeadlines = function () {
		$http({
			method: 'GET',
			url: '/headlines.json'
		}).then(function (res) {
			$scope.headlines = res.data.items;
			$timeout(fetchHeadlines, 1000 * 300); // check each 5 minutes
		}, function (res) {
			$log.error('could not fetch headlines', res.status);
		});
	};

	$timeout(fetchHeadlines); // fetch headlines immediately
  });
