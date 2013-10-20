'use strict';

angular.module('angularGoogleMapsApp').controller('ApiCtrl', function ($scope, $anchorScroll, $timeout, $location) {

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



    $scope.viewUrl = function (directive) {
    	return 'views/directive/' + directive + '.html';
    };

	$anchorScroll();    
  });
