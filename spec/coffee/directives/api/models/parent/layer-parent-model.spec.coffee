describe "LayerParentModelSpec", ->
    beforeEach ->
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
        # (@scope, @element, @attrs, @mapCtrl, @$timeout, @onLayerCreated = undefined, @$log = directives.api.utils.Logger)
        @constructor = directives.api.models.parent.LayerParentModel
        @subject = new @constructor(@scope,{},@attrs,@mapCtrl,@timeout)
    afterEach ->
        google.map = @tempMaps

    it "constructor is defined", ->
        expect(@constructor).toBeDefined()
    it "subject is defined", ->
        expect(@subject).toBeDefined()

    it "options set", ->
        expect(@setOpts.blah).toBe(@scope.options.blah)