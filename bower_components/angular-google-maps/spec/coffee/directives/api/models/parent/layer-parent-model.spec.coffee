describe "LayerParentModelSpec", ->
    beforeEach ->
        module("google-maps.mocks")
        angular.module('mockModule', ["google-maps"])
        .value('mapCtrl',
          getMap: ()->
            document.gMap)
        .value('element', {})
        .value('attrs', {})
        .value('model', {})
        .value('scope', @scope)

        module "mockModule"
        inject (GoogleApiMock) ->
          mock = new GoogleApiMock()
          mock.mockAPI()

        @scope =
            options :
                blah:true
            $watch:()->
            $on:()->
        @attrs =
            type:"testLayer"
            options:"someBoundAttr"
        self = @
        @setOpts
        @tempMaps = google.maps
        google.maps.testLayer =  (opts)=>
            self.setOpts = opts
            setMap:()->
        @mapCtrl =
            getMap: ->
        @timeout = (fnc,time) =>
            fnc()

        inject ($rootScope, LayerParentModel) =>
            scope = $rootScope.$new()
            @constructor = LayerParentModel
            @scope = _.extend @scope, scope
            @subject = new @constructor(@scope,{},@attrs,@mapCtrl,@timeout)

    afterEach ->
        google.map = @tempMaps

    it "constructor is defined", ->
        expect(@constructor).toBeDefined()
    it "subject is defined", ->
        expect(@subject).toBeDefined()

    it "options set", ->
        expect(@setOpts.blah).toBe(@scope.options.blah)