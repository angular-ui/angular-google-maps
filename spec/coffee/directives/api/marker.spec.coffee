describe "directives.api.Marker", ->
  beforeEach ->
    module "google-maps.mocks".ns()

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

    inject ['GoogleApiMock','$rootScope', '$q', 'Marker'.ns(),(GoogleApiMock,$rootScope, $q, Marker) =>
      @gmap = new GoogleApiMock()
      @gmap.initAll()
      @$rootScope = $rootScope
      d = $q.defer()
      d.resolve {}
      @$rootScope.deferred = d
      @mocks.ctrl.getScope =  =>
        @$rootScope
      @mocks.scope.$new = () =>
        @$rootScope.$new()
      @mocks.scope.deferred = d
      @subject = new Marker()
    ]

  it 'can be created', ->
    expect(@subject).toBeDefined()

  describe "link", ->
    it 'gMarkerManager exists', ->
      @subject.link(@mocks.scope, @mocks.element, @mocks.attrs, @mocks.ctrl)
      @$rootScope.$apply()
      expect(@subject.gMarkerManager).toBeDefined()

    it 'slaps control functions when a control is available', ->
      @subject.link(@mocks.scope, @mocks.element, @mocks.attrs, @mocks.ctrl)
      @$rootScope.$apply()
      expect(@mocks.scope.control.getGMarkers).toBeDefined()

    it 'slaps control functions work', ->
      @subject.link(@mocks.scope, @mocks.element, @mocks.attrs, @mocks.ctrl)
      @$rootScope.$apply()
      fn = @mocks.scope.control.getGMarkers
      expect(fn).toBeDefined()
      expect(fn()[0].key).toEqual(@mocks.scope.idKey)
