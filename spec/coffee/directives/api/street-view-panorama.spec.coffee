describe 'uiGmapStreetViewPanorama (directive creation)', ->
  allDone =  undefined
  rootScope = null
  timeout = null
  GMarker = null
  digest = null
  apiPromise = null

  afterEach ->
    digest = null

  beforeEach ->
    digest = (fn) =>
      fn()
#      timeout?.flush()
      rootScope?.$apply()

    @html = """
      <ui-gmap-street-view-panorama control="control" focalCoord="focalCoord" radius="50" >
      </ui-gmap-street-view-panorama>
    """
    @focalCoord =
      longitude: 47
      latitude: -27
#    module "uiGmapgoogle-maps"
    apiMock = window['uiGmapInitiator'].initMock().apiMock
    inject ['$rootScope', '$timeout', '$compile', '$q', 'uiGmapGoogleMapApi',
      ($rootScope, $timeout, $compile, $q, uiGmapGoogleMapApi ) =>
        apiPromise = uiGmapGoogleMapApi
        rootScope = $rootScope
        timeout = $timeout
        @compile = $compile
    ]

  it 'created', (done) ->
    scope = rootScope.$new()
    _.extend scope,
      focalCoord: @focalCoord
      control: {}


    element = @compile(@html)(scope)
    digest =>
      apiPromise.then =>
        expect(scope.control.getGObject).toBeDefined()
        done()
