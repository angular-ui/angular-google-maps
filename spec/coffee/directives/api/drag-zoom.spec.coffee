describe 'uiGmapDragZoom spec', ->
  allDone = undefined
  rootScope = null
  timeout = null
  mockMap = null

  digest = (fn) =>
    fn()
    timeout.flush()
    rootScope.$apply()

  beforeEach ->

    apiMock = window['uiGmapInitiator'].initMock().apiMock

    inject ['$rootScope', '$timeout', '$compile', '$q', 'uiGmapDragZoom', 'uiGmapGoogleMapApi',
      ($rootScope, $timeout, $compile, $q, DragZoom, Api) =>
        rootScope = $rootScope
        timeout = $timeout

        @enableKeyDragZoom = (opts) ->
        spyOn(@, 'enableKeyDragZoom')

        mockMap = =>
          map = apiMock.getMap()
          map.prototype.enableKeyDragZoom = @enableKeyDragZoom
        mockMap()

        @compile = $compile
        @subject = DragZoom
    ]

  it 'should be called from creation', (done) ->
    html = """
        <ui-gmap-google-map draggable="true" center="map.center" zoom="map.zoom">
            <ui-gmap-drag-zoom keyboardkey="'alt'" spec="spec"></ui-gmap-drag-zoom>
        </ui-gmap-google-map>
             """
    scope = rootScope.$new()
    scope.items = []
    scope.map = {}
    scope.map.zoom = 12
    scope.map.center = {longitude: 47, latitude: -27}
    scope.spec =
      enableKeyDragZoom: ->

    spyOn(scope.spec, 'enableKeyDragZoom')

    element = @compile(html)(scope)
    digest =>
      timeout =>
        #when it gets here map.prototype.enableKeyDragZoom has been squashed
        expect(scope.spec.enableKeyDragZoom).toHaveBeenCalled()
        done()
      , 300
      #when map.prototype.enableKeyDragZoom is ok, rootScope apply is calling init which squashes it

  it 'exists', ->
    expect(@subject).toBeDefined()
