'use strict';

angular.module('angularGoogleMapsApp')
  .directive('affix',['$log', function ($log) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {      

      	var opts = {
      		offset: {}
      	};
      	
      	if (attrs.offsetTop) {
      		opts.offset.top = parseInt(attrs.offsetTop);
      	}
      	
      	if (attrs.offsetBottom) {
      		opts.offset.bottom = parseInt(attrs.offsetBottom);
      	}
      	
      	$log.debug('affix options', opts);
      	
      	angular.element(element).affix(opts);
      }
    };
  }]);
