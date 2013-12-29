'use strict';

angular.module('angularGoogleMapsApp').controller('ApiCtrl', function ($scope, $anchorScroll, $timeout, $location) {

    // TODO make this auto-generated from jsdoc
    var documentedDirectives = [
        'google-map',
        'marker',
        'markers',
        'marker-label',
        'label',
        'polygon',
        'polyline',
        'trafficlayer',
        'window',
        'windows'
    ];

    $scope.displayedDirectives = documentedDirectives;

    $scope.viewUrl = function (directive) {
    	return '/views/directive/' + directive + '.html';
    };
    
    $scope.query = null;
    
    $scope.$watch('query', function (nVal, oVal) {
        if (nVal !== oVal) {
            if (nVal && nVal !== "") {
                $scope.displayedDirectives = _.filter(documentedDirectives, function (value) {
                    return value.indexOf(nVal) !== -1;
                });
            }
            else {
                $scope.displayedDirectives = documentedDirectives;
            }
        }
    });

	$anchorScroll();    
  });
