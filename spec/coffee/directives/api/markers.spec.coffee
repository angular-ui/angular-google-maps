describe 'markers directive test', ->
  allDone =  undefined
  rootScope = null
  timeout = null
  GMarker = null

  digest = (fn) =>
    fn()
    timeout.flush()
    rootScope.$apply()

  afterEach ->
    GMarker.resetInstances()

  beforeEach ->
    apiMock = window['uiGmapInitiator'].initMock().apiMock
    GMarker = window.google.maps.Marker
    inject ['$rootScope', '$timeout', '$compile', '$q', 'uiGmapMarkers',
      ($rootScope, $timeout, $compile, $q, Markers) =>
        rootScope = $rootScope
        timeout = $timeout
        @compile = $compile
        @subject = Markers
    ]

  describe 'should add markers for each object in model',  ->
    it 'from start', (done) ->
      html = """
        <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
            <ui-gmap-markers models="items" coords="'self'" ></ui-gmap-markers>
        </ui-gmap-google-map>
             """
      scope = rootScope.$new()
      scope.map = {}
      scope.map.zoom = 12
      scope.map.center = {longitude: 47, latitude: -27}

      toPush = {}
      toPush.id = 0
      toPush.latitude = 47
      toPush.longitude = -27
      scope.items = [toPush]
      element = @compile(html)(scope)
      digest =>
        timeout =>
          expect(GMarker.instances).toEqual(1)
          done()


    it 'from dynamic lazyUpdate', (done) ->
      html = """
        <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
            <ui-gmap-markers models="items" coords="'self'" ></ui-gmap-markers>
        </ui-gmap-google-map>
             """
      scope = rootScope.$new()
      scope.items = []
      scope.map = {}
      scope.map.zoom = 12
      scope.map.center = {longitude: 47, latitude: -27}

      scope.$watch 'items', (nv) ->
        console.log(nv)

      element = @compile(html)(scope)
      expect(GMarker.instances).toEqual(0)
      digest =>
        timeout ->
          toPush = {}
          toPush.id = 0
          toPush.latitude = 47
          toPush.longitude = -27
          scope.items.push(toPush)
        , 250
        timeout =>
          expect(GMarker.instances).toEqual(1)
          done()
        , 350
        
  describe 'can eval expressions', ->
    it 'handles click expression to function', (done) ->
      html = """
        <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
            <ui-gmap-markers models="items" coords="'self'" click='onClick' ></ui-gmap-markers>
        </ui-gmap-google-map>
             """
      scope = rootScope.$new()
      scope.onClick = ->
      spyOn scope, 'onClick'
      scope.map = {}
      scope.map.zoom = 12
      scope.map.center = {longitude: 47, latitude: -27}

      toPush = {}
      toPush.id = 0
      toPush.latitude = 47
      toPush.longitude = -27
      scope.items = [toPush]

      listener = GMarker.creationSubscribe @, (gMarker) ->
        _.delay ->
          window.google.maps.event.fireListener(gMarker,'click')
          expect(scope.onClick).toHaveBeenCalled()
          done()
        , 400

      #force gMarker object to invoke click
      digest =>
        element = @compile(html)(scope)
        timeout =>
          expect(GMarker.instances).toEqual(1)
          GMarker.creationUnSubscribe listener

  it 'exists', ->
    expect(@subject).toBeDefined()
