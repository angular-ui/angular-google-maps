describe 'uiGmapCircle', ->
  allDone =  undefined
  GCircle = null
  modelClicked = false

  afterEach ->
    window.google.maps.event.clearListeners()
    GCircle.resetInstances()
    modelClicked = false

  beforeEach ->

    @html = """
      <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
          <ui-gmap-circle center='map.circle.center'
                        radius='map.circle.radius'
                        fill='map.circle.fill'
                        stroke='map.circle.stroke'
                        clickable='map.circle.clickable'
                        draggable='map.circle.draggable'
                        editable='map.circle.editable'
                        visible='map.circle.visible'
                        events='map.circle.events'
                        control='map.circle.control'>
        </ui-gmap-circle>
      </ui-gmap-google-map>
    """
    map =
      zoom: 12
      center : {longitude: 47, latitude: -27}

    @circle =
      id: 1,
      center: {longitude: 47, latitude: -27},
      radius: 500,
      stroke:
        color: '#08B21F',
        weight: 2,
        opacity: 1
      fill:
        color: '#08B21F',
        opacity: 0.5
      geodesic: true
      draggable: true
      clickable: true
      editable: true
      visible: true
      events:
        radius_changed: (gObject) ->
        center_changed: (gObject) ->
      control: {}

    apiMock = window['uiGmapInitiator']
    .initMock(@, ->
      GCircle = window.google.maps.Circle
    ).apiMock

    @injects.push (uiGmapCircle) =>
      @subject = uiGmapCircle

    spyOn @circle.events, 'radius_changed'
    spyOn @circle.events, 'center_changed'

    map.circle = @circle

    @scope = angular.extend @scope or {}, map: map

    @injectAll()

  describe 'should add one circle',  ->
    it 'from start', (done) ->

      @digest =>
        @timeout =>
          expect(GCircle.instances).toEqual(1)
          done()

  describe 'events', ->
    it 'call radius changed once', (done) ->

      listener = GCircle.creationSubscribe @, (gObject) =>
        _.delay =>
          window.google.maps.event.fireListener(gObject,'radius_changed')
          expect(@circle.events.radius_changed).toHaveBeenCalled()
          expect(@circle.events.radius_changed.calls.count()).toBe(1)
          done()

      @digest =>
        @timeout =>
          expect(GCircle.instances).toEqual(1)
          GCircle.creationUnSubscribe listener
        , 500

    describe "updates gObject from model", ->
      it 'change center', (done) ->
        #issue 1271
        @digest =>
          @timeout =>
            @circle.center =
              longitude: 50
              latitude: -50
            # @circle.radius = 1
            @digest =>
              @timeout =>
                gTestObject = @circle.control.getCircle().getCenter()
                expect(gTestObject?.lng()).toBe(50)
                expect(gTestObject?.lat()).toBe(-50)
                done()
          , 500

      it 'change center if directive events is not defined', (done) ->
        #issue 1271
        @html = """
          <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
              <ui-gmap-circle center='map.circle.center'
                            radius='map.circle.radius'
                            fill='map.circle.fill'
                            stroke='map.circle.stroke'
                            clickable='map.circle.clickable'
                            draggable='map.circle.draggable'
                            editable='map.circle.editable'
                            visible='map.circle.visible'
                            control='map.circle.control'>
            </ui-gmap-circle>
          </ui-gmap-google-map>
        """

        @digest =>
          @timeout =>
            @digest =>
              listener = GCircle.creationSubscribe @, (gObject) =>
                _.delay =>
                  gObject.setCenter
                    lat: ->
                      -50
                    lng: ->
                      50

                  window.google.maps.event.fireListener(gObject,'center_changed')
                  @digest =>
                    @timeout =>
                      expect(@scope.map.circle.center.longitude).toBe(50)
                      expect(@scope.map.circle.center.latitude).toBe(-50)
                      done()
                  , false
                , 200
          , 500
        , false
    it 'change radius does not fire center_changed', (done) ->
      listener = GCircle.creationSubscribe @, (gObject) =>
        _.delay =>
          @digest =>
            gObject.setRadius 200
            expect(@circle.events.radius_changed).toHaveBeenCalled()
            expect(@circle.events.center_changed).not.toHaveBeenCalled()
            done()
      @digest =>
        @timeout =>
          GCircle.creationUnSubscribe listener
        , 500

    it 'change center does not fire radius_changed', (done) ->
      listener = GCircle.creationSubscribe @, (gObject) =>
        _.delay =>
          @digest =>
            gObject.setCenter
              lng: -> 50
              lat: -> -50
            expect(@circle.events.center_changed).toHaveBeenCalled()
            expect(@circle.events.radius_changed).not.toHaveBeenCalled()
            done()
      @digest =>
        GCircle.creationUnSubscribe listener

  it 'exists', ->
    expect(@subject).toBeDefined()

  it 'creates control', (done) ->
    @digest =>
      @timeout =>
        expect(@circle.control.getCircle).toBeDefined()
        expect(@circle.control.getCircle()).toEqual(jasmine.any(GCircle))
        done()
  describe "updates model from gObject", ->
    it 'change center', (done) ->
      listener = GCircle.creationSubscribe @, (gObject) =>
        _.delay =>
          gObject.setCenter
            lng: -> 50
            lat: -> -50
          @digest =>
            @timeout =>
              expect(@circle.center.latitude).toBe(-50)
              expect(@circle.center.longitude).toBe(50)
              done()
      @digest =>
        @timeout =>
          GCircle.creationUnSubscribe listener
        , 500
