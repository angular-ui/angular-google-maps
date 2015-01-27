describe 'PolygonsParentModel', ->
  beforeEach ->
    @scope = {}
    #define / inject values into the item we are testing... not a controller but it allows us to inject
    angular.mock.module('uiGmapgoogle-maps.directives.api.models.parent')

    apiMock = window['uiGmapInitiator'].initMock().apiMock

    inject ['$rootScope', 'uiGmapPolygonsParentModel', 'uiGmapGoogleMapsUtilV3',
      ($rootScope, ParentModel, GoogleMapsUtilV3) =>
        GoogleMapsUtilV3.init()
        scope = $rootScope.$new()

        @scope = _.extend scope, @scope
        @testCtor = ParentModel

        @subject = new @testCtor(@scope, {}, {}, {})
        @subject
    ]

  it 'constructor exist', ->
    expect(@testCtor).toBeDefined()

  it 'can be created', ->
    expect(@subject).toBeDefined()

  it 'has plurals', ->
    expect(@subject.plurals).toBeDefined()