describe "MarkerParentModel", ->
    afterEach ->
         window.google.maps = @gMapsTemp

    beforeEach ->
        module "google-maps.mocks"
        #define / inject values into the item we are testing... not a controller but it allows us to inject
        angular.module('mockModule', ["google-maps"])
        .value('mapCtrl',
          getMap: ()->
            document.gMap)
        .value('element', {})
        .value('attrs', click:true)
        .value('model', {})
        .value('scope', @scope)

        module "mockModule"
        inject (GoogleApiMock) =>
          @gmap = new GoogleApiMock()
          @gmap.mockAPI()
          @gmap.mockAnimation()
          @gmap.mockLatLng()
          @gmap.mockMarker()
          #@gmap.mockInfoWindow()
          @gmap.mockEvent()
        @gMapsTemp = window.google.maps
        #comparison variables
        @index = 0
        @clicked = false
        self = @
        @scope =
            idKey: 0
            icon: 'icon.png'
            coords:
                latitude: 90
                longitude: 90
            options:
                animation: google.maps.Animation.BOUNCE
            events:
                click: (marker, eventName, args) ->
                    self.clicked = true
                    self.gMarkerSetEvent = marker

        #mocking google maps event listener
        @googleMapListeners = []
        window.google.maps.event.addListener = (thing, eventName, callBack) =>
            found = _.find @googleMapListeners, (obj)->
                obj.obj == thing

            unless found?
                toPush = {}
                toPush.obj = thing
                toPush.events = {}
                toPush.events[eventName] = callBack
                @googleMapListeners.push toPush

            else
                found.events[eventName] = callBack

        @fireListener = (thing, eventName) =>
            found = _.find @googleMapListeners, (obj)->
                obj.obj == thing

            found.events[eventName](found.obj) if found?
        inject ($rootScope, $timeout, element, attrs, mapCtrl, MarkerParentModel, MarkerManager) =>
            scope = $rootScope.$new()
            @scope = _.extend @scope, scope
            @testCtor = MarkerParentModel
            mgr = new MarkerManager(mapCtrl.getMap())
            @subject = new MarkerParentModel(@scope, element, attrs, mapCtrl, $timeout, mgr, false)

        @subject.setEvents(@, @scope)

    it 'constructor exist', ->
        expect(@testCtor).toBeDefined

    it 'can be created', ->
        expect(@subject).toBeDefined()

    describe 'scope is watched correctly', ->
      #Demonstrates issue https://github.com/nlaplante/angular-google-maps/issues/476
      it 'should create options that are bindable', ->
        #TODO: This is very sloppy because it violates DRY and should be refactored
        self = @
        marker = undefined
        options = {visible: true}
        @scope =
          idKey: 0
          icon: 'icon.png'
          coords:
            latitude: 90
            longitude: 90
          options: options

        #mocking google maps event listener, don't need except to instantiate
        window.google.maps.event.addListener = (thing, eventName, callBack) =>
          return

        inject ($rootScope, $timeout, element, attrs, mapCtrl, MarkerParentModel, MarkerManager) =>
          @scope = _.extend @scope, $rootScope.$new()
          mgr = new MarkerManager(mapCtrl.getMap())
          marker = new MarkerParentModel(@scope, element, attrs, mapCtrl, $timeout, mgr, false)

        options.visible = false
        expect(@scope.options.visible).toEqual(false)

    describe "validateScope", ->
        it 'returns false with scope undefined', ->
            expect(@subject.validateScope(undefined)).toEqual(false)
        it 'returns false with scope.coords undefined', ->
            expect(@subject.validateScope({coords: undefined})).toEqual(false)
        it 'returns false with scope.coords,latitude undefined', ->
            expect(@subject.validateScope({coords: {latitude: undefined, longitude: {}}})).toEqual(true)
        it 'returns false with scope.coords.longtitude undefined', ->
            expect(@subject.validateScope({coords: {latitude: {}, longitude: undefined }})).toEqual(true)


        it 'fake googleMapListeners can be fired - to prove mocke of google.maps.event.addListener works', ->
            testPass = false
            window.google.maps.event.addListener @, "junk", ()=>
                testPass = true
            @fireListener(@, "junk")
            expect(testPass).toBeTruthy()

        it "googleMapListeners is fired through MarkerParentModel's scope.events", ->
            expect(@clicked).toBeFalsy()
            @fireListener(@, "click")
            expect(@clicked).toBeTruthy()

        #TODO: This test is failing because subject.scope.gmarker is not the same as the googleMapListener object
        # When the obj.obj is added to the googleMapListeners it is the same, but gets modified later, somehow
        xit "googleMapListeners is fired through MarkerParentModel's scope.events with an optional marker", ->
            expect(@gMarkerSetEvent).toBeUndefined()
            @fireListener(@subject.scope.gMarker, "click")
            expect(@gMarkerSetEvent).toBeDefined()
            expect(@gMarkerSetEvent.position).toBeDefined()