describe 'uiGmapMapTypesParentModelSpec', ->
  beforeEach ->

    window['uiGmapInitiator'].initMock @, (apiMock) =>
      apiMock.mockAPI()
      apiMock.mockMap()
      @tempMaps = google.maps
      @mapCtrl = new window.google.maps.Map()

    angular.module('mockModule', ['uiGmapgoogle-maps', 'uiGmapgoogle-maps.mocks'])
    .value('mapCtrl', {})
    .value('element', {})
    .value('attrs', {})
    .value('model', {})
    .value('scope', @scope)

    scope = mapTypes: [
      { options:
        getTileUrl: ->
        visible: true }
      { options:
        getTileUrl: ->
        visible: false }
    ]

    @attrs =
      options: 'options'
      show: 'visible'

    @timeout = (fnc, time) =>
      fnc()

    @injects.push (uiGmapMapTypesParentModel) =>
      @constructor = uiGmapMapTypesParentModel
      _.extend @scope, scope
      @subject = new @constructor(@scope, {}, @attrs, @mapCtrl)

    @injectAll()

  it 'constructor is defined', ->
    expect(@constructor).toBeDefined()
  it 'subject is defined', ->
    expect(@subject).toBeDefined()
