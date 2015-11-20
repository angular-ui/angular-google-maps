describe 'uiGmapPolyline', ->
  allDone =  undefined
  Polyline = null

  beforeEach ->

    window['uiGmapInitiator'].initMock @, ->
      Polyline = window.google.maps.Polyline
      Polyline.resetInstances()

    @injects.push (uiGmapPolyline) =>
        @subject = uiGmapPolyline

    @injectAll()

  describe 'can create a polyline', ->
    it 'from start', ->
      @html = """
        <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
          <ui-gmap-polyline ng-repeat="i in items" path="i.path">
          </ui-gmap-polyline>
        </ui-gmap-google-map>
        """
      @scope.map = {}
      @scope.map.zoom = 12
      @scope.map.center = {longitude: 47, latitude: -27}
      @digest =>
        toPush = {}
        toPush.id = 0
        toPush.path = [
          {latitude:47
          longitude: -27},
          {latitude:57
          longitude: -37}
        ]
        @scope.items = [toPush]


      expect(Polyline.instances).toEqual(1)

    it 'from dynamic lazyUpdate', (done) ->
      @html = """
        <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
          <ui-gmap-polyline ng-repeat="i in items" path="i.path">
          </ui-gmap-polyline>
        </ui-gmap-google-map>
        """
      @scope.map = {}
      @scope.map.zoom = 12
      @scope.map.center = {longitude: 47, latitude: -27}

      toPush = {}
      toPush.id = 0
      toPush.path = [
        {latitude:47
        longitude: -27},
        {latitude:57
        longitude: -37}
      ]
      @scope.items = []
      @digest =>
        @timeout =>
          @scope.items.push toPush
        , 250
        @timeout ->
          expect(Polyline.instances).toEqual(1)
          done()
        , 400

  it 'exists', ->
    expect(@subject).toBeDefined()
