'use strict';

angular.module('angularGoogleMapsApp')
  .controller('ApiCtrl', function ($scope) {
    $scope.directives = [
    	'google-map',
    	'marker',
    	'markers',
    	'label',
    	'polygon',
    	'polyline',
    	'trafficlayer',
    	'window',
    	'windows'
    ];
  });
