'use strict';

angular.module('angularGoogleMapsApp').controller('ApiCtrl', function ($scope, $location) {

    $scope.directives = [
        'google-map',
        'circle',
        'layer',
        'marker',
        'marker-label',
        'markers',
        'polygon',
        'polyline',
        'rectangle',
        'window',
        'windows'
    ];    

    $scope.viewUrl = function (directive) {
    	return '/views/directive/' + directive + '.html';
    };
    
    $scope.query = null;
    	
    $scope.$watch(function () {
    	return $location.hash();
    }, function (newValue, oldValue) {
    	if (newValue !== oldValue) {
    		$('#content' + newValue).collapse('show');
    	}
    });
  });
