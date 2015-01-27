describe 'uiGmapWindowsParentModel', ->
  beforeEach ->
    angular.mock.module('mockModule', 'uiGmapgoogle-maps')


    inject  ($rootScope, uiGmapWindowsParentModel) =>
        @scope = $rootScope.$new()
        @subject = new uiGmapWindowsParentModel(@scope, {}, {}, {})

  it 'has plurals', ->
    expect(@subject.plurals).toBeDefined()