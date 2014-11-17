describe 'uiGmapWindowsParentModel', ->
  beforeEach ->
    angular.mock.module('uiGmapgoogle-maps.directives.api.models.parent')

    inject ['$rootScope', '$timeout', '$compile', '$http', '$templateCache', '$interpolate',
    ($rootScope, $timeout, $compile, $http, $templateCache, $interpolate) =>
      @scope = $rootScope.$new()
      @subject = new WindowsParentModel(@scope,)
    ]
