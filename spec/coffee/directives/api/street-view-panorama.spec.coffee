describe 'uiGmapStreetViewPanorama (directive creation)', ->
  allDone =  undefined
  GMarker = null
  apiPromise = null

  beforeEach ->
    @html = """
      <ui-gmap-street-view-panorama control="control" focalCoord="focalCoord" radius="50" >
      </ui-gmap-street-view-panorama>
    """
    @focalCoord =
      longitude: 47
      latitude: -27

    window['uiGmapInitiator'].initMock(@)
    @injects.push (uiGmapGoogleMapApi ) =>
      apiPromise = uiGmapGoogleMapApi

    @injectAll()

  it 'created', (done) ->
    _.extend @scope,
      focalCoord: @focalCoord
      control: {}

    @digest =>
      apiPromise.then =>
        expect(@scope.control.getGObject).toBeDefined()
        done()
