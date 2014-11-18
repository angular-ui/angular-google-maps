describe 'uiGmapLayerParentModelSpec', ->
    beforeEach ->
        module('uiGmapgoogle-maps.mocks')
        angular.module('mockModule', ['uiGmapgoogle-maps'])
        .value('mapCtrl', {})
        .value('element', {})
        .value('attrs', {})
        .value('model', {})
        .value('scope', @scope)

        module 'mockModule'
        inject (GoogleApiMock) ->
          mock = new GoogleApiMock()
          mock.mockAPI()

        @scope =
            options :
                blah:true
            $watch:()->
            $on:()->
        @attrs =
            type:'testLayer'
            options:'someBoundAttr'
        self = @
        @setOpts
        @tempMaps = google.maps
        google.maps.testLayer =  (opts)=>
            self.setOpts = opts
            setMap:()->

        @mapCtrl = {}

        @timeout = (fnc,time) =>
            fnc()

        inject ['$rootScope', 'uiGmapLayerParentModel', ($rootScope, LayerParentModel) =>
            scope = $rootScope.$new()
            @constructor = LayerParentModel
            @scope = _.extend @scope, scope
            @subject = new @constructor(@scope,{},@attrs,@mapCtrl)
        ]

    afterEach ->
        google.map = @tempMaps

    it 'constructor is defined', ->
        expect(@constructor).toBeDefined()
    it 'subject is defined', ->
        expect(@subject).toBeDefined()

    it 'options set', ->
        expect(@setOpts.blah).toBe(@scope.options.blah)
