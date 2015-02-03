describe 'PolygonsParentModel', ->
  beforeEach ->
    #define / inject values into the item we are testing... not a controller but it allows us to inject
    angular.mock.module('uiGmapgoogle-maps.directives.api.models.parent')

    window['uiGmapInitiator'].initMock(@)

    @injects.push (uiGmapPolygonsParentModel, uiGmapGoogleMapsUtilV3) =>
        uiGmapGoogleMapsUtilV3.init()
        @testCtor = uiGmapPolygonsParentModel
        @subject = new @testCtor(@scope, {}, {}, {})
        @subject
    @injectAll()

  it 'constructor exist', ->
    expect(@testCtor).toBeDefined()

  it 'can be created', ->
    expect(@subject).toBeDefined()

  it 'has plurals', ->
    expect(@subject.plurals).toBeDefined()
