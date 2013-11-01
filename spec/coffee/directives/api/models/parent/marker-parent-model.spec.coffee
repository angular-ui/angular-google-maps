describe "MarkerParentModel", ->
    beforeEach( ->
        #comparison variables
        @index = 0
        @scope=
            icon:'icon.png'
            coords:
                latitude:90
                longitude:90
            options:
                animation:google.maps.Animation.BOUNCE

        #define / inject values into the item we are testing... not a controller but it allows us to inject
        angular.module('mockModule',[])
        .value('mapCtrl',
            getMap:()->
                document.gMap)
        .value('element',{})
        .value('attrs',{})
        .value('model',{})
        .value('scope',@scope)
        .controller 'subject', (scope, element, attrs, mapCtrl, $timeout) =>
                @subject = new directives.api.models.parent.MarkerParentModel(scope, element, attrs, mapCtrl, $timeout)
        angular.mock.module('mockModule')
        inject ($timeout,$rootScope,$log,$controller) =>
            directives.api.utils.Logger.logger = $log
            scope = $rootScope.$new()
            @scope = _.extend @scope,scope
            $controller 'subject',
                scope : scope
    )
    it 'constructor exist', ->
        test = directives.api.models.parent.MarkerParentModel?
        expect(test).toEqual(true)

    it 'can be created', ->
        expect(@subject?).toEqual(true)
    describe "validateScope", ->
        it 'returns fals with scope undefined', ->
            expect(@subject.validateScope(undefined)).toEqual(false)
        it 'returns fals with scope.coords undefined', ->
            expect(@subject.validateScope({coords:undefined})).toEqual(false)
        it 'returns fals with scope.coords,latitude undefined', ->
            expect(@subject.validateScope({coords:{latitude:undefined,longitude:{}}})).toEqual(false)
        it 'returns fals with scope.coords.longtitude undefined', ->
            expect(@subject.validateScope({coords:{latitude:{},longitude:undefined }})).toEqual(false)