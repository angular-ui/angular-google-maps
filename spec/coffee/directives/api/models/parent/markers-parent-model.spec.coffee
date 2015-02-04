# TODO: These tests are failing because something is not mocked correctly
# in the clusterermanager. Likely google.maps.overlayview.
describe 'MarkersParentModel - Clusterer Event Extensions', ->
  afterEach ->
    self.markerModelsCluster = undefined
  beforeEach ->
    @clusterTest =
      getMarkers: ->
        map = new PropMap()
        map.push {key: 1}
        map.push {key: 2}
        map

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
          self.markerModelsCluster = 'crap'
      doCluster: 'true'
      models: []

    #define / inject values into the item we are testing... not a controller but it allows us to inject
    angular.module('mockModule', ['uiGmapgoogle-maps','uiGmapgoogle-maps.mocks'])
    .value('map', document.gMap)
    .value('element', {})
    .value('attrs', click: true)
    .value('model', {})
    .value('scope', @scope)

    module 'mockModule'
    window['uiGmapInitiator'].initMock(@)

    @injects.push (element, attrs, map, uiGmapMarkersParentModel, uiGmapGoogleMapsUtilV3,uiGmapExtendMarkerClusterer) =>
        uiGmapGoogleMapsUtilV3.init()
        uiGmapExtendMarkerClusterer.init()

        @scope.options =
          animation: google.maps.Animation.BOUNCE
        @testCtor = uiGmapMarkersParentModel

        @subject = new @testCtor(@scope, element, attrs, map)
        @subject

    @injectAll()

  it 'constructor exist', ->
    expect(@testCtor).toBeDefined()

  it 'can be created', ->
    expect(@subject).toBeDefined()

  it 'has plurals', ->
    expect(@subject.plurals).toBeDefined()

  describe 'clusterEvents', ->
    describe 'basic event handling', ->
      describe 'is fired', ->
        describe 'mapped extension', ->
          it 'click - ', ->
            @subject.plurals.put 1, model: 'test1'
            @subject.plurals.put 2, model: 'test2'
            @subject.scope.clusterEvents.click @clusterTest
            expect(_.all(@markerModelsCluster, (entity, i)=>
              entity == @subject.plurals.get(i+1).model
            )).toBeTruthy()
          it 'mouseout - ', ->
            @subject.plurals.put 1, model: 'test1'
            @subject.plurals.put 2, model: 'test2'
            @subject.scope.clusterEvents.mouseout @clusterTest
            expect(_.all(@markerModelsCluster, (entity, i)=>
              entity == @subject.plurals.get(i+1).model
            )).toBeTruthy()
          it 'mouseover - ', ->
            @subject.plurals.put 1, model: 'test1'
            @subject.plurals.put 2, model: 'test2'
            @subject.scope.clusterEvents.mouseover @clusterTest
            expect(_.all(@markerModelsCluster, (entity, i)=>
              entity == @subject.plurals.get(i+1).model
            )).toBeTruthy()
        describe 'some legacy event', =>
          it 'crap - ', -> #not a real event but shows that any existing function can be fired
            @subject.gManager.opt_events.crap()
            expect(@markerModelsCluster).toBe('crap')
      describe 'not fired', ->
        it 'click - ', ->
