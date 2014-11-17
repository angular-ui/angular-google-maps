describe "directives.api.polygon", ->
  beforeEach ->
    window['uiGmapInitiator'].initDirective @, 'Polygon'

    @html = angular.element """
    <ui-gmap-google-map center="map.center" zoom="map.zoom">
      <ui-gmap-polygon static="true" ng-repeat="p in map.polygons track by p.id" path="p.path" stroke="p.stroke" visible="p.visible"
        geodesic="p.geodesic" fill="p.fill" fit="false"
        editable="p.editable"
        draggable="p.draggable"
        control="map.polygon.control"
        events="map.polygon.events">
      </ui-gmap-polygon>
    </ui-gmap-google-map>
      """

    @scope.map = _.extend @scope.map,
      polygon:
        events:
          click: (p) ->
          dblclick: (p) ->
          mouseover: (p) ->
        control: {}
      polygons: [
        {
          id: 1,
          path: [
            {
              latitude: 50,
              longitude: -80
            },
            {
              latitude: 30,
              longitude: -120
            },
            {
              latitude: 20,
              longitude: -95
            }
          ],
          stroke:
            color: '#6060FB',
            weight: 3,
          editable: true,
          draggable: true,
          geodesic: false,
          visible: true,
          fill:
            color: '#ff0000',
            opacity: 0.8
        }
      ],
      polygons2: [
        {
          id: 1,
          path: [
            {
              latitude: 60,
              longitude: -80
            },
            {
              latitude: 40,
              longitude: -120
            },
            {
              latitude: 45,
              longitude: -95
            }
          ],
          stroke:
            color: '#33CDDC',
            weight: 3,
          editable: true,
          draggable: true,
          geodesic: false,
          visible: true,
          fill:
            color: '#33CCCC',
            opacity: 0.8
        }
      ]

  it "can be created", ->
    expect(@subject).toBeDefined()
    @log.error.calls.reset()

  it "created a single instance", (done) ->
    element = @compile(@html)(@scope)
    @rootScope.$apply()
    @scope.map.polygon.control.promise.then =>
      expect(@scope.map.polygon.control.polygons.length).toBe(1)
      done()
    @log.error.calls.reset()
    @rootScope.$apply()

  it "created 3 listeners", (done) ->
    element = @compile(@html)(@scope)
    @rootScope.$apply()
    @scope.map.polygon.control.promise.then =>
      expect(@scope.map.polygon.control.polygons[0].listeners.length).toBe 3
      done()
    @log.error.calls.reset()
    @rootScope.$apply()
