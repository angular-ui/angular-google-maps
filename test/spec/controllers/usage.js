'use strict';

describe('Controller: UsageCtrl', function () {

  // load the controller's module
  beforeEach(module('angularGoogleMapsApp'));

  var UsageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsageCtrl = $controller('UsageCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
