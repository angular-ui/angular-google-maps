'use strict';

describe('Controller: DemoCtrl', function () {

  // load the controller's module
  beforeEach(module('angularGoogleMapsApp'));

  var DemoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DemoCtrl = $controller('DemoCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
