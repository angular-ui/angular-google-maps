'use strict';

describe('Service: github', function () {

  // load the service's module
  beforeEach(module('angularGoogleMapsApp'));

  // instantiate service
  var github;
  beforeEach(inject(function ($github) {
    github = $github;
  }));

  it('should do something', function () {
    expect(!!github).toBe(true);
  });

  // TODO write more tests
});
