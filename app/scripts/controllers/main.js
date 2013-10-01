'use strict';

angular.module('angularGoogleMapsApp')
  .controller('MainCtrl', function ($scope) {
    
    $scope.map = {
    	center: {
    		latitude: 45,
    		longitude: -73
    	},
    	zoom: 8
    };
  });
