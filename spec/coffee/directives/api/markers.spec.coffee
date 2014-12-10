describe 'uiGmapMarkers (directive creation)', ->
  allDone =  undefined
  rootScope = null
  timeout = null
  GMarker = null
  digest = null
  modelClicked = false

  afterEach ->
    digest = null
    GMarker.resetInstances()
    modelClicked = false

  beforeEach ->
    digest = (fn) =>
     fn()
     timeout?.flush()
     rootScope?.$apply()
     
    @html = """
      <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
          <ui-gmap-markers models="items" coords="'self'" click="'onClick'" ></ui-gmap-markers>
      </ui-gmap-google-map>
    """
    @map =
      zoom: 12
      center : {longitude: 47, latitude: -27}
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
      scope = rootScope.$new()
      _.extend scope, map: @map

      toPush = {}
      toPush.id = 0
      toPush.latitude = 47
      toPush.longitude = -27
      scope.items = [toPush]
      element = @compile(@html)(scope)
      digest =>
        timeout =>
          expect(GMarker.instances).toEqual(1)
          done()


  describe 'dynamic', ->
    it 'delayed creation', (done) ->
      scope = rootScope.$new()
      scope.items = []
      _.extend scope, map: @map

      element = @compile(@html)(scope)
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

    describe 'update an existing marker should modify an existing gMarker', =>
      beforeEach ->
        @updateTest = (done, updateFn ) =>
          scope = rootScope.$new()
          scope.onClick = ->
          spyOn scope, 'onClick'
          _.extend scope, map: @map

          scope.items = [
            {
              id:0,
              latitude:47,
              longitude: -27
            },
            {
              id:1,
              latitude:67,
              longitude: -57
            }
          ]
          update =
            id:1,
            latitude:89,
            longitude: -150

          createdGMarkers = []
          listener = GMarker.creationSubscribe @, (gMarker) ->
            createdGMarkers.push gMarker

          _.delay ->
            gMarker = _.last(createdGMarkers)
            expect(gMarker.key).toBe(1)
            expect(gMarker.getPosition().lng()).toBe(update.longitude)
            expect(gMarker.getPosition().lat()).toBe(update.latitude)
            done()
          , 500
          #force gMarker object to invoke click
          digest =>
            element = @compile(@html)(scope)
            timeout =>
              expect(GMarker.instances).toEqual(2)
              GMarker.creationUnSubscribe listener
              updateFn(scope.items, update)

      it 'by reference', (done) ->
        @updateTest done, (items, update) ->
          items[1] = update

      it 'by position (model)', (done) ->
        @updateTest done, (items, update) ->
          model = items[1]
          model.latitude = update.latitude
          model.longitude = update.longitude

  describe 'can eval key function', ->
    it 'handles click function in model', (done) ->
      scope = rootScope.$new()
#      spyOn scope.items[1], 'onClick'
      _.extend scope, map: @map

      toPush = {
        id: 0,
        latitude:47,
        longitude: -27,
        onClick: ->
          modelClicked = true
      }
      scope.items = [toPush]

      listener = GMarker.creationSubscribe @, (gMarker) ->
        _.delay ->
          window.google.maps.event.fireListener(gMarker,'click')
          expect(modelClicked).toBeTruthy()
          done()
        , 250

      #force gMarker object to invoke click
      digest =>
        element = @compile(@html)(scope)
        timeout ->
          expect(GMarker.instances).toEqual(1)
          GMarker.creationUnSubscribe listener

  it 'exists', ->
    expect(@subject).toBeDefined()
