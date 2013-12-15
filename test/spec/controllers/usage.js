'use strict';

describe('Controller: UseCtrl', function () {

  // load the controller's module
  beforeEach(module('angularGoogleMapsApp'));

  var UsageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsageCtrl = $controller('UseCtrl', {
      $scope: scope
    });
  }));
});
