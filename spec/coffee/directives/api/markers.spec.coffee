describe "markers directive test", ->
  beforeEach ->
    #TODO: These modules really need dependencies setup properly
    module("google-maps.mocks")
    module("google-maps")
    module("google-maps.directives.api.utils")

    inject ($rootScope, $timeout, $compile, GoogleApiMock) =>
      @rootScope = $rootScope
      @timeout = $timeout
      @compile = $compile
      @apiMock = new GoogleApiMock()
      @apiMock.mockAPI()
      @apiMock.mockMap()
      @markerCount = 0
      @marker = (opts) => @markerCount++
      @marker.prototype = @apiMock.getMarker().prototype
      @apiMock.mockMarker(@marker)

  xit "should add markers for each object in model", ->
    #TODO: We ought to be able to make this test pass, just need to figure _async I think -MDB.
    html = """
      <google-map draggable="true" center="map.center" zoom="map.zoom">
          <markers models="items" coords="'self'" ></markers>
      </google-map>
           """
    scope = @rootScope.$new()
    scope.items = []
    scope.map = {}
    scope.map.zoom = 12
    scope.map.center = {longitude: 47, latitude: -27}


    scope.$watch 'items', (nv) ->
      console.log(nv)

    element = @compile(html)(scope)
    scope.$apply()
    expect(@markerCount).toEqual(0)
    @timeout () =>
      toPush = {}
      toPush.latitude = 47
      toPush.longitude = -27
      scope.items.push(toPush)
    @timeout.flush()
    expect(@markerCount).toEqual(1)

