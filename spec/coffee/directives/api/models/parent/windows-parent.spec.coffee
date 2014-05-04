describe "WindowsParentModel", ->
  beforeEach ->
    angular.mock.module("google-maps.directives.api.models.parent")

    inject($rootScope, $timeout, $compile, $http, $templateCache, $interpolate) =>
      @scope = $rootScope.$new()
      @subject = new WindowsParentModel(@scope, )
