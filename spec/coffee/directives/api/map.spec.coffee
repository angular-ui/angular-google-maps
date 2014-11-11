describe "directives.api.map", ->
  beforeEach ->
    window['uiGmapInitiator'].initDirective @, "Map", ['initAll'], {}
  afterEach ->
    @log.error.calls.reset()

  # it "can be created", ->
  #   @scope.map.center =
  #     longitude: 47
  #     latitude: -27
  #   expect(@subject).toBeDefined()

  it "it should delay creation until center is set", ->
    html = angular.element """
      <ui-gmap-google-map center="map.center" control="map.control" zoom="map.zoom">
      </ui-gmap-google-map>
      """
    @scope.map.control = {}
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@scope.map.control.getGMap).toBeUndefined()
    @scope.map.zoom = 10
    @scope.map.center =
      longitude: 47
      latitude: -27
    @scope.$apply()
    expect(@scope.map.control.getGMap).toBeDefined()
