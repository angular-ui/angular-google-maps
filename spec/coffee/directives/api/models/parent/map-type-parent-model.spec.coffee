describe 'uiGmapMapTypeParentModelSpec', ->
  beforeEach ->

    window['uiGmapInitiator'].initMock @, (apiMock) =>
      apiMock.mockAPI()
      apiMock.mockMap()
      @tempMaps = google.maps
      google.maps.ImageMapType = (opts) =>
        @setOpts = opts
        getTileUrl: ->

      spyOn(google.maps, 'ImageMapType').and.callThrough();
      @mapCtrl = new window.google.maps.Map()

    angular.module('mockModule', ['uiGmapgoogle-maps', 'uiGmapgoogle-maps.mocks'])
    .value('mapCtrl', {})
    .value('element', {})
    .value('attrs', {})
    .value('model', {})
    .value('scope', @scope)

    scope =
      options:
        blah: true
        getTileUrl: ->

      $watch: ->
      $on: ->
    @attrs =
      id: 'testmaptype'
      options: 'someBoundAttr'


    @timeout = (fnc, time) =>
      fnc()

    @injects.push (uiGmapMapTypeParentModel) =>
      @constructor = uiGmapMapTypeParentModel
      _.extend @scope, scope
      @subject = new @constructor(@scope, {}, @attrs, @mapCtrl)

    @injectAll()

  afterEach ->
    google.maps = @tempMaps

  it 'constructor is defined', ->
    expect(@constructor).toBeDefined()
  it 'options set', ->
    expect(@setOpts.blah).toBe(@scope.options.blah)
  it 'subject is defined', ->
    expect(@subject).toBeDefined()
  it 'maptype is an ImageMapType instance if getTileUrl method is provided', ->
    expect(google.maps.ImageMapType).toHaveBeenCalled()
