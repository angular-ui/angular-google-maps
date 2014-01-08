'use strict';

angular.module('angularGoogleMapsApp').controller('ApiCtrl', function ($scope) {

    $scope.directives = [
        'google-map',
        'layer',
        'marker',
        'marker-label',
        'markers',
        'polygon',
        'polyline',
        'window',
        'windows'
    ];    

    $scope.viewUrl = function (directive) {
    	return '/views/directive/' + directive + '.html';
    };
    
    $scope.query = null;
  });
