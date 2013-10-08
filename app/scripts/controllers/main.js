'use strict';

angular.module('angularGoogleMapsApp')
  .controller('MainCtrl', function ($scope, $http, $log) {
    
    $scope.map = {
    	center: {
    		latitude: 45,
    		longitude: -73
    	},
    	zoom: 8
    };

    $http({
    	method: 'GET',
    	url: '/headlines.json'
    }).then(function (res) {
    	$scope.headlines = res.data.items;
    }, function (res) {
    	$log.error('could not fetch headlines', res.status);
    });
  });
