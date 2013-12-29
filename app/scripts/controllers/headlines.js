'use strict';

angular.module('angularGoogleMapsApp')
  .controller('HeadlinesCtrl', function ($scope, $http, $log, $interval, headlinesFetchInterval) {
  
  	var showAtMost = 3, loadMoreCount = 10;
  
	var fetchHeadlines = function () {
	
		$http({
			method: 'GET',
			url: '/headlines.json'
		}).then(function (res) {
			$scope.headlines = res.data.items;
			$scope.count = res.data.items.length;
			$log.debug('headlines: fetched', res.data.items.length, 'headlines')
		}, function (res) {
			$log.error('could not fetch headlines', res.status);
		});
	};
	
	$log.debug('headlines: fetch updates every ' + (headlinesFetchInterval / 1000 / 60) + ' minute(s)');
	
	$interval(fetchHeadlines, headlinesFetchInterval).then(function () {
			// noop
		}, function (e) {
			$log.error('an error has occured in interval', e);
		}, function (headlines) {
			$log.info('fetched headlines');
		}
	);
		
	$scope.displayed = function () {
		return _.first($scope.headlines, showAtMost);
	};
	
	$scope.loadMore = function () {
		showAtMost += loadMoreCount;
	};
	
	// 1st execution
	fetchHeadlines.apply(this, []);
  });
