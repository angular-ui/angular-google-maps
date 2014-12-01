describe 'uiGmapPolyline', ->
  allDone =  undefined
  rootScope = null
  timeout = null
  Polyline = null

  digest = (fn) =>
    fn()
    timeout.flush()
    rootScope.$apply()

  beforeEach ->

    apiMock = window['uiGmapInitiator'].initMock().apiMock

    inject ['$rootScope', '$timeout', '$compile', '$q', 'uiGmapPolyline',
      ($rootScope, $timeout, $compile, $q, uiGmapPolyline) =>
        rootScope = $rootScope
        timeout = $timeout
        @compile = $compile
        Polyline = window.google.maps.Polyline
        Polyline.resetInstances()
        @subject = uiGmapPolyline
    ]

  describe 'can create a polyline', ->
    it 'from start', ->
      html = """
        <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
          <ui-gmap-polyline ng-repeat="i in items" path="i.path">
          </ui-gmap-polyline>
        </ui-gmap-google-map>
        """
      scope = rootScope.$new()
      scope.map = {}
      scope.map.zoom = 12
      scope.map.center = {longitude: 47, latitude: -27}
      element = @compile(html)(scope)
      digest =>
        toPush = {}
        toPush.id = 0
        toPush.path = [
          {latitude:47
          longitude: -27},
          {latitude:57
          longitude: -37}
        ]
        scope.items = [toPush]


      expect(Polyline.instances).toEqual(1)

    it 'from dynamic lazyUpdate', (done) ->
      html = """
        <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
          <ui-gmap-polyline ng-repeat="i in items" path="i.path">
          </ui-gmap-polyline>
        </ui-gmap-google-map>
        """
      scope = rootScope.$new()
      scope.map = {}
      scope.map.zoom = 12
      scope.map.center = {longitude: 47, latitude: -27}
      element = @compile(html)(scope)
      toPush = {}
      toPush.id = 0
      toPush.path = [
        {latitude:47
        longitude: -27},
        {latitude:57
        longitude: -37}
      ]
      scope.items = []
      digest ->
        timeout ->
          scope.items.push toPush
        , 250
        timeout ->
          expect(Polyline.instances).toEqual(1)
          done()
        , 400

  it 'exists', ->
    expect(@subject).toBeDefined()
