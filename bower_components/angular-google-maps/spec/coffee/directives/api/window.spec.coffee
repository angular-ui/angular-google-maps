describe "directives.api.Window", ->
    beforeEach ->
        window.google
        module "google-maps"
        module "google-maps.mocks"
        inject (GoogleApiMock) =>
          @gmap = new GoogleApiMock()
          @gmap.mockAPI()
          @gmap.mockLatLng()
          @gmap.mockMarker()
          @gmap.mockInfoWindow()
          @gmap.mockEvent()
        ### Possible Attributes
                coords: '=coords',
				show: '=show',
				templateUrl: '=templateurl',
				templateParameter: '=templateparameter',
				isIconVisibleOnClick: '=isiconvisibleonclick',
				closeClick: '&closeclick',           #scope glue to gmap InfoWindow closeclick
				options: '=options'
        ###
        @mocks =
            scope:
                coords:
                    latitude: 90.0
                    longitude: 89.0
                show: true
                $watch:()->
                $on:()->
            element:
                html: ->
                    "<p>test html</p>"
            attrs: {
                isiconvisibleonclick:true
            }
            ctrls: [
                {
                  getMap:()->
                    {}
                }
            ]

        @timeOutNoW = (fnc,time) =>
            fnc()
        @gMarker = new google.maps.Marker(@commonOpts)
        inject (_$rootScope_,$q, $compile, $http, $templateCache, $injector, Window) =>
            @$rootScope =  _$rootScope_
            d = $q.defer()
            d.resolve @gmap

            @$rootScope.deferred = d
            @mocks.ctrls[0].getScope =  =>
                @$rootScope
            @windowScope = _.extend @$rootScope.$new(), @mocks.scope


            @subject = new Window(@timeOutNoW,$compile, $http, $templateCache)
            @subject.onChildCreation = (child) =>
                @childWindow = child

            @prom = d.promise
            return

    it "should test receive the fulfilled promise!!", ->
        result = undefined
        @prom.then (returnFromPromise) ->
            result = returnFromPromise
        @$rootScope.$apply() # promises are resolved/dispatched only on next $digest cycle
        expect(result).toBe @gmap

    it 'can be created', ->
        expect(@subject).toBeDefined()
        expect(@subject.index).toEqual(@index)

    it 'link creates window options and a childWindow', ->

        @subject.link(@windowScope, @mocks.element, @mocks.attrs, @mocks.ctrls)
        crap = null
        @prom.then ->
            crap = "set"
        #holy crap $rootScope.$apply() must come after all promises!!!!!
        @$rootScope.$apply() #force $q to resolve
        expect(crap).toBe 'set'
        expect(@childWindow).toBeDefined()
        expect(@childWindow.opts).toBeDefined()