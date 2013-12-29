'use strict';

describe('Controller: ApiCtrl', function () {

  // load the controller's module
  beforeEach(module('angularGoogleMapsApp'));

  var ApiCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApiCtrl = $controller('ApiCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of directives to the scope', function () {
    expect(scope.displayedDirectives.length).not.toBe(0);
  });
});
