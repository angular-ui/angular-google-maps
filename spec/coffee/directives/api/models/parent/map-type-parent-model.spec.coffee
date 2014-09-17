describe "MapTypeParentModelSpec".ns(), ->
    beforeEach ->
        module("google-maps.mocks")
        angular.module('mockModule', ["google-maps".ns()])
        .value('mapCtrl', {})
        .value('element', {})
        .value('attrs', {})
        .value('model', {})
        .value('scope', @scope)

        module "mockModule"
        inject (GoogleApiMock) =>
          mock = new GoogleApiMock()
          mock.mockAPI()
          mock.mockMap()

        @scope =
            options :
                blah:true
                getTileUrl:()->

            $watch:()->
            $on:()->
        @attrs =
            id: "testmaptype"
            options: "someBoundAttr"
        self = @
        @setOpts
        @tempMaps = google.maps
        google.maps.ImageMapType = (opts) =>
            self.setOpts = opts
            getTileUrl:()->
        spyOn(google.maps, 'ImageMapType').and.callThrough();

        @mapCtrl = new window.google.maps.Map()

        @timeout = (fnc,time) =>
            fnc()

        inject ['$rootScope','MapTypeParentModel'.ns(), ($rootScope, MapTypeParentModel) =>
            scope = $rootScope.$new()
            @constructor = MapTypeParentModel
            @scope = _.extend @scope, scope
            @subject = new @constructor(@scope, {}, @attrs, @mapCtrl)
        ]

    afterEach ->
        google.maps = @tempMaps

    it "constructor is defined", ->
        expect(@constructor).toBeDefined()
    it "options set", ->
        expect(@setOpts.blah).toBe(@scope.options.blah)
    it "subject is defined", ->
        expect(@subject).toBeDefined()
    it "maptype is an ImageMapType instance if getTileUrl method is provided", ->
        expect(google.maps.ImageMapType).toHaveBeenCalled()

