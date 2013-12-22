'use strict';

describe('Directive: rel', function () {

  // load the directive's module
  beforeEach(module('angularGoogleMapsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should set blank target', inject(function ($compile) {    
    element = angular.element($compile(angular.element('<a rel="external">i\'m an external link!</a>'))(scope));        
    expect(element.attr('target')).toBe('_blank');
  }));
  
  it('should not do anything special', inject(function ($compile) {
  	element = angular.element($compile(angular.element('<a rel="author">Nicolas Laplante</a>'))(scope));
  	expect(element.attr('target')).toBeUndefined();
  }));
});
