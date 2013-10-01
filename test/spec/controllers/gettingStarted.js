'use strict';

describe('Controller: GettingStartedCtrl', function () {

  // load the controller's module
  beforeEach(module('angularGoogleMapsApp'));

  var GettingStartedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GettingStartedCtrl = $controller('GettingStartedCtrl', {
      $scope: scope
    });
  }));

});
