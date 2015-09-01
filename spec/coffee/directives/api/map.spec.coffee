describe "uiGmapMap", ->
  beforeEach ->
    window['uiGmapInitiator'].initDirective @, "Map", ['initAll'], {}
    @html = """
      <ui-gmap-google-map center='map.center'
        control='map.control' zoom='map.zoom'
        options ='map.options'
        events='map.events'>
      </ui-gmap-google-map>
      """
    @scope =
      map:
        events: {}
        options: {}
        control: {}
        zoom: 10
        center:
          longitude: 47
          latitude: -27

    @injectAll()

  afterEach ->
    @scope = null
    @log.error.calls.reset()

  describe "control props are set", ->
    it "getGMap", ->
      @digest =>
        expect(@scope.map.control.getGMap).toBeUndefined()
      expect(@scope.map.control.getGMap).toBeDefined()

    it "refresh", ->
      @digest =>
        expect(@scope.map.control.refresh).toBeUndefined()
      expect(@scope.map.control.refresh).toBeDefined()
    
    it "getMapOptions", ->
      @digest =>
        expect(@scope.map.control.getMapOptions).toBeUndefined()
      expect(@scope.map.control.getMapOptions).toBeDefined()

  describe 'blackList events', ->
    it '(all) blocks all but defaults', ->
      @scope.map.events =
        blacklist: 'all'
      @digest ->
      events = google.maps.event.normalizedEvents()
      eventsBeyondDefaults =
        _.without events, 'idle'
      expect(_.isEmpty eventsBeyondDefaults).toBeTruthy()

    it '(dragstart) blocks only itself', ->
      @scope.map.events =
        blacklist: 'dragstart'
      @digest ->
      events = google.maps.event.normalizedEvents()
      eventsBeyondDefaults =
        _.without events,
          'idle', 'dragend', 'drag',
          'zoom_changed', 'center_changed',
      expect(_.isEmpty eventsBeyondDefaults).toBeTruthy()

    it '(dragstart) blocks only itself', ->
      @scope.map.events =
        blacklist: 'dragstart'
      @digest ->
      events = google.maps.event.normalizedEvents()
      eventsBeyondDefaults =
        _.without events,
          'idle', 'dragend', 'drag',
          'zoom_changed', 'center_changed',
          expect(_.isEmpty eventsBeyondDefaults).toBeTruthy()

    it '(dragend) blocks only itself', ->
      @scope.map.events =
        blacklist: 'dragstart'
      @digest ->
      events = google.maps.event.normalizedEvents()
      eventsBeyondDefaults =
        _.without events,
          'idle', 'dragstart', 'drag',
          'zoom_changed', 'center_changed',
          expect(_.isEmpty eventsBeyondDefaults).toBeTruthy()

    it '(drag) blocks only itself', ->
      @scope.map.events =
        blacklist: 'dragstart'
      @digest ->
      events = google.maps.event.normalizedEvents()
      eventsBeyondDefaults =
        _.without events,
          'idle', 'dragstart', 'dragend',
          'zoom_changed', 'center_changed',
          expect(_.isEmpty eventsBeyondDefaults).toBeTruthy()

    it '(zoom_changed) blocks only itself', ->
      @scope.map.events =
        blacklist: 'dragstart'
      @digest ->
      events = google.maps.event.normalizedEvents()
      eventsBeyondDefaults =
        _.without events,
          'idle', 'dragstart', 'dragend',
          'drag', 'center_changed',
          expect(_.isEmpty eventsBeyondDefaults).toBeTruthy()

    it '(center_changed) blocks only itself', ->
      @scope.map.events =
        blacklist: 'dragstart'
      @digest ->
      events = google.maps.event.normalizedEvents()
      eventsBeyondDefaults =
        _.without events,
          'idle', 'dragstart', 'dragend',
          'drag', 'zoom_changed',
          expect(_.isEmpty eventsBeyondDefaults).toBeTruthy()
