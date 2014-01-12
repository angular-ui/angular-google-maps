'use strict';

angular.module('angularGoogleMapsApp')
  .directive('googleApi', function ($log) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      
      	// Open links wil rel='external' in new window/tab      	
      	var el = angular.element(element);
      	
      	el.attr('href', 'https://developers.google.com/maps/documentation/javascript/reference#' + attrs.googleApi)
      		.attr('rel', 'external');
      }
    };
  });
