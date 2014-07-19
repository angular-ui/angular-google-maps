describe "directives.api.Marker", ->
  beforeEach ->
    module "google-maps"
    module "google-maps.mocks"
    inject (GoogleApiMock) =>
      @gmap = new GoogleApiMock()
      @gmap.mockAPI()
      @gmap.mockLatLng()
      @gmap.mockMarker()
      @gmap.mockEvent()

    @mocks =
      scope:
        idKey: 0
        coords:
          latitude: 90.0
          longitude: 89.0
        show: true
        $watch: ()->
        $on: ()->
        control: {}

      element:
        html: ->
          "<p>test html</p>"
      attrs:
        isiconvisibleonclick: true
      ctrl:
        getMap: ()->
          {}
    @timeOutNoW = (fnc, time) =>
      fnc()
    inject ($rootScope, Marker) =>
      @mocks.scope.$new = () =>
        $rootScope.$new()
      @subject = new Marker(@timeOutNoW)

  it 'can be created', ->
    expect(@subject).toBeDefined()

  describe "link", ->
    it 'gMarkerManager exists', ->
      @subject.link(@mocks.scope, @mocks.element, @mocks.attrs, @mocks.ctrl)
      expect(@subject.gMarkerManager).toBeDefined()

    it 'slaps control functions when a control is available', ->
      @subject.link(@mocks.scope, @mocks.element, @mocks.attrs, @mocks.ctrl)
      expect(@mocks.scope.control.getGMarkers).toBeDefined()

    it 'slaps control functions work', ->
      @subject.link(@mocks.scope, @mocks.element, @mocks.attrs, @mocks.ctrl)
      fn = @mocks.scope.control.getGMarkers
      expect(fn).toBeDefined()
      expect(fn()[0].key).toEqual(@mocks.scope.idKey)