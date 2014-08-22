describe "WindowsParentModel".ns(), ->
  beforeEach ->
    angular.mock.module("google-maps.directives.api.models.parent".ns())

    inject ['$rootScope', '$timeout', '$compile', '$http', '$templateCache', '$interpolate',
    ($rootScope, $timeout, $compile, $http, $templateCache, $interpolate) =>
      @scope = $rootScope.$new()
      @subject = new WindowsParentModel(@scope,)
    ]
