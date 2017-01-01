describe "directives.api.control", ->
  beforeEach ->
    window['uiGmapInitiator'].initDirective @, "Control"
    @injects.push ($templateCache) ->
      $templateCache.put('mockControl.tpl.html', '<button class="mock">Control</button>')
    @injectAll()

  it "can be created", ->
    expect(@subject).toBeDefined()
    @log.error.calls.reset()

  it "should load template", ->
    html = angular.element """
      <ui-gmap-google-map center="map.center" zoom="map.zoom">
        <ui-gmap-map-control template="mockControl.tpl.html"></ui-gmap-map-control>
      </ui-gmap-google-map>
      """
    @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).not.toHaveBeenCalled()
    @log.error.calls.reset()
  #TODO: confirm it was added to the map.Controls[position] Array

  it "should validate position attribute", ->
    html = angular.element """
        <ui-gmap-google-map center="map.center" zoom="map.zoom">
            <ui-gmap-map-control template="mockControl.tpl.html" position="bad-position">
            </ui-gmap-map-control>
        </ui-gmap-google-map>"""
    @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).toHaveBeenCalledWith('mapControl: invalid position property')
    @log.error.calls.reset()

  it "error was called bottom_center", ->
    html = angular.element """
      <ui-gmap-google-map center="map.center" zoom="map.zoom">
        <ui-gmap-map-control template="mockControl.tpl.html" position="bottom-center"></ui-gmap-map-control>
      </ui-gmap-google-map>
      """
    @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).not.toHaveBeenCalled()
    @log.error.calls.reset()

  it "error was called - top_left", ->
    html = angular.element """
      <ui-gmap-google-map center="map.center" zoom="map.zoom">
        <ui-gmap-map-control template="mockControl.tpl.html" position="ToP_LefT"></ui-gmap-map-control>
      </ui-gmap-google-map>
      """
    @compile(html)(@scope)
    @rootScope.$apply()
    expect(@log.error).not.toHaveBeenCalled()
    @log.error.calls.reset()
