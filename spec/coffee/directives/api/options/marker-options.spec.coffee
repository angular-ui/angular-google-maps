describe 'marker-options', ->
  beforeEach ->
    module 'uiGmapgoogle-maps.directives.api.options'
    module 'uiGmapgoogle-maps.mocks'
    inject [ 'uiGmapMarkerOptions', 'GoogleApiMock', (@subject, GoogleApiMock) =>
      @gmap = new GoogleApiMock()
      @gmap.mockAPI()
      @gmap.mockMVCArray()
      @gmap.mockPoint()
      @gmap.mockLatLng()
      @gmap.mockLatLngBounds()
    ]


  describe 'should create markers with correct scope', ->
    it 'should create the correct scope on the marker', ->
      latLng = {latitude: 1, longitude: 2}
      options = {visible: true}
      defaults = {
        coords: latLng,
        options: options
      }
      mOpts = @subject.createOptions latLng, undefined, defaults
      expect(mOpts.visible).toEqual(defaults.options.visible)
      options.visible = false;
      expect(mOpts.options.visible).toEqual(defaults.options.visible)

    it 'should respect changes to options', ->
      latLng = {latitude: 1, longitude: 2}
      options = {icon: 'icon'}
      defaults = {
        coords: latLng,
        options: options
      }
      mOpts = @subject.createOptions latLng, options.icon, defaults
      expect(mOpts.icon).toEqual(defaults.options.icon)
      options.icon = 'foo';
      expect(mOpts.options.icon).toEqual(defaults.options.icon)
