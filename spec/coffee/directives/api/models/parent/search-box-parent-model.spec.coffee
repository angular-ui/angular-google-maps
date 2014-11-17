describe "uiGmapSearchBoxParentModelSpec", ->
  beforeEach ->
    module("uiGmapgoogle-maps.mocks")
    module('uiGmapgoogle-maps')
    module("uiGmapgoogle-maps.directives.api.utils")

    inject ($templateCache) ->
      $templateCache.put('searchbox.tpl.html', '<input placeholder="Search Box">')

    inject ['$rootScope', 'GoogleApiMock', '$compile', 'uiGmapSearchBoxParentModel',
      ($rootScope, GoogleApiMock, $compile, SearchBoxParentModel) =>
        @rootScope = $rootScope
        @apiMock = new GoogleApiMock()
        @compile = $compile
        @apiMock.mockAPI()
        @apiMock.mockMap()
        @apiMock.mockPlaces()
        @apiMock.mockSearchBox()
        @subject = SearchBoxParentModel

    ]

  it "should add a searchbox", ->
    html = """
      <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
          <ui-gmap-search-box template="searchbox.tpl.html"></ui-gmap-search-box>
      </ui-gmap-google-map>
           """
    scope = @rootScope.$new()
    scope.map = {}
    scope.map.zoom = 12
    scope.map.center = {longitude: 47, latitude: -27}
    element = @compile(html)(scope)

  it "exists", ->
    expect(@subject).toBeDefined()
