describe "directives.api.control.extended", ->
  beforeEach ->
    window['uiGmapInitiator'].initDirective @, "Control"

    @injectAll()

  it "can be created", ->
    expect(@subject).toBeDefined()
    @log.error.calls.reset()


  it "should validate position attribute", ->
    html = angular.element """
        <ui-gmap-google-map center="map.center" zoom="map.zoom">
            <ui-gmap-map-extended-control position="bad-position">
            </ui-gmap-map-extended-control>
        </ui-gmap-google-map>"""
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).toHaveBeenCalledWith('mapControl: invalid position property')
    @log.error.calls.reset()

  it "error was called bottom_center", ->
    html = angular.element """
      <ui-gmap-google-map center="map.center" zoom="map.zoom">
        <ui-gmap-map-extended-control  position="bottom-center"></ui-gmap-map-extended-control>
      </ui-gmap-google-map>
      """
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).not.toHaveBeenCalled()
    @log.error.calls.reset()

  it "error was called - top_left", ->
    html = angular.element """
      <ui-gmap-google-map center="map.center" zoom="map.zoom">
        <ui-gmap-map-extended-control  position="ToP_LefT"></ui-gmap-map-extended-control>
      </ui-gmap-google-map>
      """
    element = @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).not.toHaveBeenCalled()
    @log.error.calls.reset()
