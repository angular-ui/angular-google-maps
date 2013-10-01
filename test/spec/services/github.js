'use strict';

describe('Service: github', function () {

  // load the service's module
  beforeEach(module('angularGoogleMapsApp'));

  // instantiate service
  var github;
  beforeEach(inject(function (_github_) {
    github = _github_;
  }));

  it('should do something', function () {
    expect(!!github).toBe(true);
  });

});
