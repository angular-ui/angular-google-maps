'use strict';

angular.module('angularGoogleMapsApp')
  .directive('rel', function ($log) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
      
      	// Open links wil rel='external' in new window/tab      	
      	var el = angular.element(element);
      	
		if (el.attr('rel').indexOf('external') !== -1) {
			el.attr('target', '_blank');
		}
      }
    };
  });
