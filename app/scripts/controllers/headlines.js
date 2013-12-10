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
		}, function (res) {
			$log.error('could not fetch headlines', res.status);
		});
	};
	
	$log.info('will fetch headlines every ' + (headlinesFetchInterval / 1000 / 60) + ' minute(s)');
	
	var promise = $interval(fetchHeadlines, headlinesFetchInterval);
	
	promise.then(function () {
		// noop
	}, function (e) {
		$log.error('an error has occured in interval', e);
	}, function (headlines) {
		$log.info('fetched headlines');
	});
	
	$scope.displayed = function () {
		return _.first($scope.headlines, showAtMost);
	};
	
	$scope.loadMore = function () {
		showAtMost += loadMoreCount;
	};
	
	// 1st execution
	fetchHeadlines.apply(this, []);
  });
