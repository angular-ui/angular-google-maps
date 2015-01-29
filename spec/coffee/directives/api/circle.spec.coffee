describe 'uiGmapCircle', ->
  allDone =  undefined
  rootScope = null
  timeout = null
  GCircle = null
  digest = null
  modelClicked = false
  browser = null

  afterEach ->
    digest = null
    GCircle.resetInstances()
    modelClicked = false

  beforeEach ->
    digest = (fn) =>
     fn()
     timeout?.flush() if browser.deferredFns?.length
     rootScope?.$digest()
     
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
                        events='map.circle.events'>
        </ui-gmap-circle>
      </ui-gmap-google-map>
    """
    @map =
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


    apiMock = window['uiGmapInitiator'].initMock().apiMock
    GCircle = window.google.maps.Circle

    inject ['$rootScope', '$timeout', '$compile', '$q', 'uiGmapCircle', '$browser',
      ($rootScope, $timeout, $compile, $q, directive, $browser) =>
        rootScope = $rootScope
        timeout = $timeout
        @compile = $compile
        @subject = directive
        browser = $browser
    ]

  describe 'should add one circle',  ->
    it 'from start', (done) ->
      scope = rootScope.$new()
      @map.circle = @circle
      _.extend scope, map: @map

      element = @compile(@html)(scope)
      digest =>
        timeout =>
          expect(GCircle.instances).toEqual(1)
          done()

  describe 'events', ->
    it 'call radius changed once', (done) ->
      scope = rootScope.$new()

      @circle.events =
        radius_changed: ->

      _spy = spyOn @circle.events, 'radius_changed'

      @map.circle = @circle
      _.extend scope, map: @map

      element = @compile(@html)(scope)

      listener = GCircle.creationSubscribe @, (gObject) =>
        _.delay =>
          window.google.maps.event.fireListener(gObject,'radius_changed')
          expect(@circle.events.radius_changed).toHaveBeenCalled()
          expect(@circle.events.radius_changed.calls.count()).toBe(1)
          done()

      digest =>
        timeout =>
          expect(GCircle.instances).toEqual(1)
          GCircle.creationUnSubscribe listener
        , 500


#  describe 'dynamic', ->
#    it 'delayed creation', (done) ->
#      scope = rootScope.$new()
#      scope.items = []
#      _.extend scope, map: @map
#
#      element = @compile(@html)(scope)
#      expect(GCircle.instances).toEqual(0)
#      digest =>
#        timeout =>
#          @map.circle = @circle
#        , 250
#        timeout =>
#          expect(GCircle.instances).toEqual(1)
#          done()
#        , 350

  it 'exists', ->
    expect(@subject).toBeDefined()
