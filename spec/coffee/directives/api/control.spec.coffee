describe "directives.api.control", ->
  beforeEach ->
    module "google-maps.mocks"
    module "google-maps".ns()

    inject (GoogleApiMock) ->
      @apiMock = new GoogleApiMock()
      @apiMock.mockAPI()
      @apiMock.mockMap()
      @apiMock.mockLatLng()
      @apiMock.mockControlPosition()

    inject ($templateCache) ->
      $templateCache.put('mockControl.tpl.html', '<button class="mock">Control</button>')

    inject ($compile, $rootScope, $timeout, nggmapControl, nggmapLogger) ->
      @compile = $compile
      @rootScope = $rootScope
      @control = new nggmapControl()
      @log = nggmapLogger

      # mock map scope
      @scope = @rootScope.$new()
      @scope.map = {}
      @scope.map.zoom = 12
      @scope.map.center =
        longitude: 47
        latitude: -27

    spyOn @log, 'error'

  it "can be created", ->
    expect(@control).toBeDefined()
    @log.error.calls.reset()

  it "should log error if no template is supplied", ->
    html = angular.element """
  								<nggmap-google-map center="map.center" zoom="map.zoom">
  									<nggmap-map-control></nggmap-map-control>
  								</nggmap-google-map>
  								"""
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).toHaveBeenCalledWith('mapControl: could not find a valid template property')
    @log.error.calls.reset()

  it "should load template", ->
    html = angular.element """
                <nggmap-google-map center="map.center" zoom="map.zoom">
									<nggmap-map-control template="mockControl.tpl.html"></nggmap-map-control>
								</nggmap-google-map>
								"""
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).not.toHaveBeenCalled()
    @log.error.calls.reset()
  #TODO: confirm it was added to the map.Controls[position] Array

  it "should validate position attribute", ->
    html = angular.element """
        <nggmap-google-map center="map.center" zoom="map.zoom">
            <nggmap-map-control template="mockControl.tpl.html" position="bad-position">
            </nggmap-map-control>
        </nggmap-google-map
        >"""
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).toHaveBeenCalledWith('mapControl: invalid position property')
    @log.error.calls.reset()

  it "error was called bottom_center", ->
    html = angular.element """
								<nggmap-google-map center="map.center" zoom="map.zoom">
									<nggmap-map-control template="mockControl.tpl.html" position="bottom-center"></nggmap-map-control>
								</nggmap-google-map>
								"""
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).not.toHaveBeenCalled()
    @log.error.calls.reset()

  it "error was called - top_left", ->
    html = angular.element """
								<nggmap-google-map center="map.center" zoom="map.zoom">
									<nggmap-map-control template="mockControl.tpl.html" position="ToP_LefT"></nggmap-map-control>
								</nggmap-google-map>
								"""
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).not.toHaveBeenCalled()
    @log.error.calls.reset()