describe 'uiGmapGoogleMapApiProvider', ->
  mapScriptLoader = null;

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
