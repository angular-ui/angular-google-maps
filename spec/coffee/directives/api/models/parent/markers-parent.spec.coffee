xdescribe "MarkersParentModel", ->
  beforeEach ->
    angular.mock.module "google-maps.directives.api.models.parent", ($provide) =>
      @provide = $provide
      class MarkerManager
        constructor: (args...) ->
          @args = args
          @constructed = true
          @drawCalled = 0
          @clearCalled = 0
          @fitCalled = 0
        draw: () ->
          @drawCalled++
        clear: () ->
          @clearCalled++
        fit:() ->
          @fitCalled++

      class ClustererMarkerManager extends MarkerManager
        constructor: (args...) ->
          super(args)
          @constructed = true
          @childConstructed = true

      class MarkerChildModel
        constructor: (@args...) ->
          @constructed = true

      @clustererMarkerManager = ClustererMarkerManager
      @markerManager = MarkerManager
      @markerChildModel = MarkerChildModel
      @provide.decorator 'ClustererMarkerManager', () => @clustererMarkerManager
      @provide.decorator 'MarkerManager', () => @markerManager
      @provide.decorator 'MarkerChildModel', () => @markerChildModel

    @clickCount = 0
    inject ($rootScope, $timeout, $compile, $http, $templateCache, $interpolate, MarkersParentModel) =>
      @rootScope = $rootScope
      @scope = $rootScope.$new()
      @ele = $compile('<markers models="models"></markers>')(@scope)
      @attrs = {click: @click}
      @MarkersParentModel = MarkersParentModel
      @$timeout = $timeout
      @scope.click = () =>
        @clickCount++

    @mapCtrl = jasmine.createSpyObj('mapCtrl', ['getMap'])
    @subject = new @MarkersParentModel(@scope, @ele, @attrs, @mapCtrl, @$timeout)

  it "should instantiate", ->
    expect(@subject?).toEqual(true)

  it "should validate a scope correctly", ->
    #XXX: Should this really validate as true if no models is set?
    expect(@subject.validateScope(@scope)).toEqual(true)
    @scope.models = [{
      latitude: 47,
      longitude: -27
    }]
    expect(@subject.validateScope(@scope)).toEqual(false)
    @scope.coords = {
      latitude: 47,
      longitude: -27
    }
    expect(@subject.validateScope(@scope)).toEqual(true)

  it "should watch the appropriate properties on timeout", ->
    props = []
    expectedProps = 'models doCluster clusterOptions clusterEvents fit idKey'.split(' ')
    @scope.$watch = (propName, func) =>
      props.push(propName)

    spyOn(@subject, 'createMarkersFromScratch')
    @subject.onTimeOut(@scope)
    #expect(props[i]).toEqual(prop) for prop, i in expectedProps
    expect(@subject.createMarkersFromScratch).toHaveBeenCalled()

  describe "watch tests", ->
    beforeEach ->
      spyOn(@subject, 'reBuildMarkers')
      spyOn(@subject, 'pieceMealMarkers')
      @idKey = @subject.idKey

    it "should watch rebuild markers and not change idKey", ->
      @subject.onWatch('foo', @scope, 'baz', 'bar')
      expect(@subject.idKey).toEqual(@idKey)
      expect(@subject.pieceMealMarkers).not.toHaveBeenCalled()
      expect(@subject.reBuildMarkers).toHaveBeenCalled()

    it "should watch and rebuild markers, but change idKey", ->
      @subject.onWatch('idKey', @scope, 'foo', @idKey)
      expect(@subject.idKey).toEqual('foo')
      expect(@subject.pieceMealMarkers).not.toHaveBeenCalled()
      expect(@subject.reBuildMarkers).toHaveBeenCalled()

    it "should watch and build piecemeal and not change idKey", ->
      @subject.doRebuildAll = false
      @subject.onWatch('foo', @scope, 'foo', @idKey)
      expect(@subject.idKey).toEqual(@idKey)
      expect(@subject.pieceMealMarkers).toHaveBeenCalled()
      expect(@subject.reBuildMarkers).not.toHaveBeenCalled()

    it "should watch and build piecemeal and change idKey", ->
      @subject.doRebuildAll = false
      @subject.onWatch('idKey', @scope, 'foo', @idKey)
      expect(@subject.idKey).toEqual('foo')
      expect(@subject.pieceMealMarkers).toHaveBeenCalled()
      expect(@subject.reBuildMarkers).not.toHaveBeenCalled()

  #TODO: need to get some negative testing in here and validate parameters a bit more
  describe "createMarkers from scratch tests", ->
    beforeEach ->
      spyOn(@subject, 'newChildMarker')
      # create a ClustererMarkerManager so that we fall into the else
      @subject.gMarkerManager = new @clustererMarkerManager()

    it "should call ClustererMarkerManager", ->
      @scope.doCluster = true
      @scope.clusterOptions = {}
      @subject.createMarkersFromScratch(@scope)
      expect(@subject.gMarkerManager.childConstructed).toEqual(true)

    it "should call not call ClustererMarkerManager when markerManager is set and options are the same as scope options", ->
      @scope.doCluster = true
      @scope.clusterOptions = {}
      @subject.gMarkerManager.opt_options = @scope.clusterOptions
      # create a ClustererMarkerManager so that we fall into the else
      # Set mock value to false, so we can verify if it gets called or not
      @subject.gMarkerManager.childConstructed = false
      @subject.createMarkersFromScratch(@scope)
      expect(@subject.gMarkerManager.childConstructed).toEqual(false)

    it "should call ClustererMarkerManager when markerManager is set and options options are not the same", ->
      @scope.doCluster = true
      @scope.clusterOptions = {}
      # Set mock value to false, so we can verify if it gets called or not
      @subject.gMarkerManager.childConstructed = false
      @subject.createMarkersFromScratch(@scope)
      expect(@subject.gMarkerManager.childConstructed).toEqual(true)

    it "should call clustererMarkerManager when doCluster is true and no clusterOptions set", ->
      @scope.doCluster = true
      @subject.createMarkersFromScratch(@scope)
      expect(@subject.gMarkerManager.childConstructed).toEqual(true)
      expect(@subject.gMarkerManager.args.length).toEqual(1)

    it "should call generic MarkerManager when no cluster options are set", ->
      @subject.createMarkersFromScratch(@scope)
      expect(@subject.gMarkerManager.childConstructed).toEqual(undefined)

    it "should call newChildMarker for each model and fit should not be called", ->
      @scope.models = [
        {}, {}
      ]
      @subject.createMarkersFromScratch(@scope)
      expect(@subject.newChildMarker.calls.length).toEqual(2)
      expect(@subject.gMarkerManager.fitCalled).toBe(0)

      #TODO: Should flesh out these tests a bit more so that the async loop is tested, right now _async is not very testable
      # because the timeout is not able to made synchronous. Passing $timeout could fix this.

  describe "Rebuild markers", ->
    @beforeEach ->
      spyOn(@subject, 'onDestroy')
      spyOn(@subject, 'createMarkersFromScratch')

    it "should return without doRebuild", ->
      @scope.doRebuild = false
      @subject.reBuildMarkers(@scope)
      expect(@subject.onDestroy).not.toHaveBeenCalled()

    it "should call on destroy and createMarkersFromScratch", ->
      @subject.reBuildMarkers(@scope)
      expect(@subject.onDestroy).toHaveBeenCalled()
      expect(@subject.createMarkersFromScratch).toHaveBeenCalled()

  # TODO: This needs to be fleshed out significantly once _async.each is testable
  describe "pieceMealMarkers", ->
    @beforeEach ->
      spyOn(@subject, 'figureOutState')
      spyOn(@subject, 'reBuildMarkers')
      spyOn(@subject, 'newChildMarker')

    it "should call reBuildMarkers", ->
      @subject.pieceMealMarkers(@scope)
      expect(@subject.reBuildMarkers).toHaveBeenCalled()

    it "should call figureOutState", ->
      @scope.models = [
        {}
      ]

      # What is markerModels?
      @scope.markerModels = [
        {}
      ]
      @subject.pieceMealMarkers(@scope)
      expect(@subject.figureOutState).toHaveBeenCalled()

  describe "newChildMarker", ->
    it "should return undefined, but call constructor", ->
      expect(@subject.newChildMarker({}, @scope)).toEqual(undefined)

    it "should return a new childMarker", ->
      model = {}
      model[@subject.idKey] = "foo"
      @scope.markerModels = {put :->}
      spyOn(@scope.markerModels, 'put')
      child = @subject.newChildMarker(model, @scope)
      expect(child.constructed).toEqual(true)
      expect(@scope.markerModels.put.calls[0].args[0]).toEqual('foo')
      expect(@scope.markerModels.put.calls[0].args[1]).toEqual(child)

  #TODO: need to figure out what to test here, looks like some refactoring in the method
  # is in order anyway, so won't put too much in here.
  describe "onDestroy", ->
    it "should succeed", ->
      @subject.onDestroy(@scope)

  #TODO: This needs to be fleshed out a lot once _async is testable
  describe "fit", ->
    it "should succeed", ->
      @subject.gMarkerManager = new @clustererMarkerManager()
      @subject.gMarkerManager.fit()




