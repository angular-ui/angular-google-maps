'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('angularGoogleMapsApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a map object to the scope', function () {
    expect(scope.map).not.toBe(null);
  });

  it('should provide minimal properties for the map to work', function () {
  	expect(scope.map.center.latitude).not.toBe(null);
  	expect(scope.map.center.longitude).not.toBe(null);
  	expect(scope.map.zoom).not.toBe(null);
  });
});
