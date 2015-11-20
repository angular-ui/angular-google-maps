describe 'uiGmapGoogleMapApiProvider', ->
  mapScriptLoader = null

  beforeEach ->
    angular.module('mockModule', ['uiGmapgoogle-maps']).config(
      ['uiGmapGoogleMapApiProvider',
        (GoogleMapApi) ->
          GoogleMapApi.configure({
            china: true
          })
      ]
    )
    module('uiGmapgoogle-maps', 'mockModule')
    inject ($injector) ->
      mapScriptLoader = $injector.get 'uiGmapMapScriptLoader'

    window.google = undefined


  it 'uses maps.google.cn when in china', ->
    options = { china: true, v: '3.17', libraries: '', language: 'en', sensor: 'false' }
    mapScriptLoader.load(options)
    lastScriptIndex = document.getElementsByTagName('script').length - 1
    expect(document.getElementsByTagName('script')[lastScriptIndex].src).toContain('http://maps.google.cn/maps/api/js')

  describe 'on Cordova devices', ->
    beforeAll ->
      window.navigator.connection = {}
      window.Connection =
        WIFI: 'wifi'
        NONE: 'none'

    afterAll -> delete window.navigator.connection

    it 'should include the script when the device is online', ->
      window.navigator.connection.type = window.Connection.WIFI

      options = { v: '3.17', libraries: '', language: 'en', sensor: 'false', device: 'online' }
      mapScriptLoader.load(options)

      lastScriptIndex = document.getElementsByTagName('script').length - 1
      expect(document.getElementsByTagName('script')[lastScriptIndex].src).toContain('device=online')

    it 'should wait for the online event to include the script when the device is offline', ->
      window.navigator.connection.type = window.Connection.NONE

      options = { v: '3.17', libraries: '', language: 'en', sensor: 'false', device: 'offline' }
      mapScriptLoader.load(options)
      lastScriptIndex = document.getElementsByTagName('script').length - 1
      expect(document.getElementsByTagName('script')[lastScriptIndex].src).not.toContain('device=offline')

      # https://github.com/ariya/phantomjs/issues/11289
      onlineEvent = document.createEvent 'CustomEvent'
      onlineEvent.initCustomEvent 'online', false, false, null
      document.dispatchEvent onlineEvent

      lastScriptIndex = document.getElementsByTagName('script').length - 1
      expect(document.getElementsByTagName('script')[lastScriptIndex].src).toContain('device=offline')
