describe "MarkerParentModel", ->
    beforeEach ->
        #comparison variables
        @index = 0
        @clicked = false
        self = @
        @scope =
            icon: 'icon.png'
            coords:
                latitude: 90
                longitude: 90
            options:
                animation: google.maps.Animation.BOUNCE
            events:
                click: (marker, eventName, args) ->
                    self.clicked = true

        #define / inject values into the item we are testing... not a controller but it allows us to inject
        angular.module('mockModule', [])
        .value('mapCtrl',
                getMap: ()->
                    document.gMap)
        .value('element', {})
        .value('attrs', {})
        .value('model', {})
        .value('scope', @scope)
        .controller 'subject', (scope, element, attrs, mapCtrl, $timeout) =>
                @subject = new directives.api.models.parent.MarkerParentModel(scope, element, attrs, mapCtrl, $timeout)
        angular.mock.module('mockModule')
        inject ($timeout, $rootScope, $log, $controller) =>
            directives.api.utils.Logger.logger = $log
            scope = $rootScope.$new()
            @scope = _.extend @scope, scope
            $controller 'subject',
                scope: scope

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

            found.events[eventName]() if found?

        @subject.setEvents(@, @scope)

    it 'constructor exist', ->
        test = directives.api.models.parent.MarkerParentModel?
        expect(test).toEqual(true)

    it 'can be created', ->
        expect(@subject?).toEqual(true)

    describe "validateScope", ->
        it 'returns fals with scope undefined', ->
            expect(@subject.validateScope(undefined)).toEqual(false)
        it 'returns fals with scope.coords undefined', ->
            expect(@subject.validateScope({coords: undefined})).toEqual(false)
        it 'returns fals with scope.coords,latitude undefined', ->
            expect(@subject.validateScope({coords: {latitude: undefined, longitude: {}}})).toEqual(true)
        it 'returns fals with scope.coords.longtitude undefined', ->
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