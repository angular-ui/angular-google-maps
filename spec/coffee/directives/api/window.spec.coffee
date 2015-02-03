describe "uiGmapWindow", ->
    beforeEach ->
        window['uiGmapInitiator'].initMock(@)
        @mocks =
            scope:
                coords:
                    latitude: 90.0
                    longitude: 89.0
                show: true
                $watch:()->
                $on:()->
                control: {}
                $evalAsync: (fn) ->
                  fn()
            element:
                html: ->
                    "<p>test html</p>"
            attrs: {
                isiconvisibleonclick:true
            }
            ctrls: [{getMap:->{}}]
        @gmap = {}
        @injects.push ['$http', '$templateCache', 'uiGmapExtendGWin', 'uiGmapWindow',
          ($http, $templateCache, ExtendGWin, Window) =>
            ExtendGWin.init()
            d = @q.defer()
            d.resolve @gmap

            @rootScope.deferred = d
            @mocks.ctrls[0].getScope = =>
                @rootScope
            @windowScope = _.extend @rootScope.$new(), @mocks.scope

            @subject = new Window()
            @subject.onChildCreation = (child) =>
                @childWindow = child

            @prom = d.promise
        ]
        @injectAll()

    it "should test receive the fulfilled promise!!", ->
        result = undefined
        @prom.then (returnFromPromise) ->
            result = returnFromPromise
        @digest =>
        expect(result).toBe @gmap

    it 'can be created', ->
        expect(@subject).toBeDefined()
#        expect(@subject.index).toEqual(@index)

    it 'link creates window options and a childWindow', ->

        @subject.link(@windowScope, @mocks.element, @mocks.attrs, @mocks.ctrls)
        crap = null
        @prom.then ->
            crap = "set"
        @digest =>
        expect(crap).toBe 'set'
        expect(@childWindow).toBeDefined()
        expect(@childWindow.opts).toBeDefined()

    it 'slaps control functions when a control is available', ->
      @subject.link(@mocks.scope, @mocks.element, @mocks.attrs, @mocks.ctrls)
      @digest =>
      expect(@mocks.scope.control.getChildWindows).toBeDefined()
      expect(@mocks.scope.control.getGWindows).toBeDefined()

    it 'control functions work', ->
      @subject.link(@mocks.scope, @mocks.element, @mocks.attrs, @mocks.ctrls)
      @digest =>
      expect(@mocks.scope.control.getChildWindows).toBeDefined()
      expect(@mocks.scope.control.getChildWindows().length).toBe(1)
      expect(@mocks.scope.control.getChildWindows()[0]).toEqual(@childWindow)
      expect(@mocks.scope.control.getGWindows()[0]).toEqual(@childWindow.gObject)
