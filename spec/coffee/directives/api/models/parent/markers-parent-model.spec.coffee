# TODO: These tests are failing because something is not mocked correctly
# in the clusterermanager. Likely google.maps.overlayview.
describe "MarkersParentModel - Clusterer Event Extensions", ->
  afterEach ->
    self.markerModelsCluster = undefined
  beforeEach ->
    @clusterTest =
      getMarkers: ->
        [{data: model: {data: 1} }
         {data: model: {data: 2} }
        ]
    @index = 0
    @clicked = false
    self = @
    @scope =
      icon: 'icon.png'
      coords:
        latitude: 90
        longitude: 90
      events:
        click: (marker, eventName, args) ->
          self.clicked = true
          self.gMarkerSetEvent = marker
      clusterOptions: {}
      clusterEvents:
        click: (cluster, markerModelsCluster) ->
          self.markerModelsCluster = markerModelsCluster
        mouseout: (cluster, markerModelsCluster) ->
          self.markerModelsCluster = markerModelsCluster
        mouseover: (cluster, markerModelsCluster) ->
          self.markerModelsCluster = markerModelsCluster
        crap: ->
          self.markerModelsCluster = "crap"
      doCluster: "true"
      models: []

    #define / inject values into the item we are testing... not a controller but it allows us to inject
    angular.module('mockModule', ["google-maps".ns(),"google-maps.mocks"])
    .value('map', document.gMap)
    .value('element', {})
    .value('attrs', click: true)
    .value('model', {})
    .value('scope', @scope)

    module "mockModule"
    inject (GoogleApiMock) =>
      @gmap = new GoogleApiMock(false)
      @gmap.mockEvent()

    inject ['$rootScope', 'element', 'attrs', 'map', 'MarkersParentModel'.ns(), 'GoogleMapsUtilV3'.ns(),'ExtendMarkerClusterer'.ns(),
      ($rootScope, element, attrs, map, MarkersParentModel, GoogleMapsUtilV3,ExtendMarkerClusterer) =>
        GoogleMapsUtilV3.init()
        ExtendMarkerClusterer.init()
        scope = $rootScope.$new()
        $timeout = ((fn)->
          fn())
        @scope = _.extend @scope, scope
        @scope.options =
          animation: google.maps.Animation.BOUNCE
        @testCtor = MarkersParentModel
        @fireListener = window.google.maps.event.fireListener
        @subject = new @testCtor(@scope, element, attrs, map, $timeout)
        @subject
    ]

  it 'constructor exist', ->
    expect(@testCtor).toBeDefined()

  it 'can be created', ->
    expect(@subject?).toBeDefined()

  describe "clusterEvents", ->
    describe "basic event handling", ->
      describe "is fired", ->
        describe "mapped extension", ->
          it 'click - ', ->
            @subject.clusterInternalOptions.click @clusterTest
            expect(@markerModelsCluster.length).toBe(2)
          it 'mouseout - ', ->
            @subject.clusterInternalOptions.click @clusterTest
            expect(@markerModelsCluster.length).toBe(2)
          it 'mouseover - ', ->
            @subject.clusterInternalOptions.click @clusterTest
            expect(@markerModelsCluster.length).toBe(2)
        describe "some legacy event", =>
          it 'crap - ', -> #not a real event but shows that any existing function can be fired
            @subject.gMarkerManager.opt_events.crap()
            expect(@markerModelsCluster).toBe("crap")
      describe "not fired", ->
        it 'click - ', ->

