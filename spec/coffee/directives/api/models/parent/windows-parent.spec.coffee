describe 'uiGmapWindowsParentModel', ->
  beforeEach ->
    angular.mock.module('uiGmapgoogle-maps.directives.api.models.parent')

    inject  ($rootScope, uiGmapWindowsParentModel) =>
        @scope = $rootScope.$new()
        @subject = new uiGmapWindowsParentModel(@scope, {}, {}, {})

  it 'has plurals', ->
    expect(@subject.plurals).toBeDefined()