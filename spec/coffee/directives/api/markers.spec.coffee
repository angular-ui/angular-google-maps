describe 'markers directive test', ->
  allDone =  undefined
  rootScope = null
  timeout = null

  digest = (fn) =>
    fn()
    timeout.flush()
    rootScope.$apply()

  beforeEach ->

    apiMock = window['uiGmapInitiator'].initMock().apiMock

    inject ['$rootScope', '$timeout', '$compile', '$q', 'uiGmapMarkers',
      ($rootScope, $timeout, $compile, $q, Markers) =>
        rootScope = $rootScope
        timeout = $timeout
        @compile = $compile
        @markerCount = 0
        @marker = (opts) =>
          @markerCount++
          allDone?()
        @marker.prototype = apiMock.getMarker().prototype
        @subject = Markers
        apiMock.mockMarker(@marker)
    ]

  describe 'should add markers for each object in model', (done) ->
    it 'from start', ->
      html = """
        <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
            <ui-gmap-markers models="items" coords="'self'" ></ui-gmap-markers>
        </ui-gmap-google-map>
             """
      scope = rootScope.$new()
      scope.map = {}
      scope.map.zoom = 12
      scope.map.center = {longitude: 47, latitude: -27}

      allDone = done
      toPush = {}
      toPush.id = 0
      toPush.latitude = 47
      toPush.longitude = -27
      scope.items = [toPush]

      element = @compile(html)(scope)
      expect(@markerCount).toEqual(0)


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
      expect(@markerCount).toEqual(0)
      digest =>
        timeout ->
          allDone = done
          toPush = {}
          toPush.id = 0
          toPush.latitude = 47
          toPush.longitude = -27
          scope.items.push(toPush)
        , 1000

#    expect(@markerCount).toEqual(1)

  it 'exists', ->
    expect(@subject).toBeDefined()
