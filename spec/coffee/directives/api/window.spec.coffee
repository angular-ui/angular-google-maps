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

        @mocks =
            scope:
                coords:
                    latitude: 90.0
                    longitude: 89.0
                show: true
                $watch:()->
                $on:()->
                control: {}
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
#        @gMarker = new google.maps.Marker(@commonOpts)
        inject (_$rootScope_,$q, $compile, $http, $templateCache, Window) =>
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
#        expect(@subject.index).toEqual(@index)

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

    it 'slaps control functions when a control is available', ->
      @subject.link(@mocks.scope, @mocks.element, @mocks.attrs, @mocks.ctrls)
      @$rootScope.$apply() #force $q to resolve
      expect(@mocks.scope.control.getChildWindows).toBeDefined()
      expect(@mocks.scope.control.getGWindows).toBeDefined()

    it 'control functions work', ->
      @subject.link(@mocks.scope, @mocks.element, @mocks.attrs, @mocks.ctrls)
      @$rootScope.$apply() #force $q to resolve
      expect(@mocks.scope.control.getChildWindows().length).toBe(1)
      expect(@mocks.scope.control.getChildWindows()[0]).toEqual(@childWindow)
      expect(@mocks.scope.control.getGWindows()[0]).toEqual(@childWindow.gWin)