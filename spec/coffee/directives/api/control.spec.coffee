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

    inject ['$compile', '$rootScope', '$timeout', 'Control'.ns(), 'Logger'.ns(), ($compile, $rootScope, $timeout, Control, Logger) ->
      @compile = $compile
      @rootScope = $rootScope
      @control = new Control()
      @log = Logger

      # mock map scope
      @scope = @rootScope.$new()
      @scope.map = {}
      @scope.map.zoom = 12
      @scope.map.center =
        longitude: 47
        latitude: -27
    ]

    spyOn @log, 'error'

  it "can be created", ->
    expect(@control).toBeDefined()
    @log.error.calls.reset()

  it "should log error if no template is supplied", ->
    html = angular.element """
      <ui-gmap-google-map center="map.center" zoom="map.zoom">
        <ui-gmap-map-control></ui-gmap-map-control>
      </ui-gmap-google-map>
      """
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).toHaveBeenCalledWith('mapControl: could not find a valid template property')
    @log.error.calls.reset()

  it "should load template", ->
    html = angular.element """
      <ui-gmap-google-map center="map.center" zoom="map.zoom">
        <ui-gmap-map-control template="mockControl.tpl.html"></ui-gmap-map-control>
      </ui-gmap-google-map>
      """
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).not.toHaveBeenCalled()
    @log.error.calls.reset()
  #TODO: confirm it was added to the map.Controls[position] Array

  it "should validate position attribute", ->
    html = angular.element """
        <ui-gmap-google-map center="map.center" zoom="map.zoom">
            <ui-gmap-map-control template="mockControl.tpl.html" position="bad-position">
            </ui-gmap-map-control>
        </ui-gmap-google-map
        >"""
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).toHaveBeenCalledWith('mapControl: invalid position property')
    @log.error.calls.reset()

  it "error was called bottom_center", ->
    html = angular.element """
      <ui-gmap-google-map center="map.center" zoom="map.zoom">
        <ui-gmap-map-control template="mockControl.tpl.html" position="bottom-center"></ui-gmap-map-control>
      </ui-gmap-google-map>
      """
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).not.toHaveBeenCalled()
    @log.error.calls.reset()

  it "error was called - top_left", ->
    html = angular.element """
      <ui-gmap-google-map center="map.center" zoom="map.zoom">
        <ui-gmap-map-control template="mockControl.tpl.html" position="ToP_LefT"></ui-gmap-map-control>
      </ui-gmap-google-map>
      """
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).not.toHaveBeenCalled()
    @log.error.calls.reset()