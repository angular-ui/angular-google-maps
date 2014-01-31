describe "WindowChildModel", ->
    beforeEach ->
        #dependencies
        #constructor: (scope, opts, isIconVisibleOnClick, mapCtrl, markerCtrl, $http, $templateCache, $compile,@element, needToManualDestroy = false)->
        @scope =
            coords:
                latitude: 90.0
                longitude: 89.0
            show: true
        @commonOpts =
            position: new google.maps.LatLng(@scope.coords.latitude, @scope.coords.longitude)
        @windowOpts = _.extend(@commonOpts, content: 'content')
        @gMarker = new google.maps.Marker(@commonOpts)
        #define / inject values into the item we are testing... not a controller but it allows us to inject
        create = (scope, opts, isIconVisibleOnClick, mapCtrl, markerCtrl, $http, $templateCache, $compile, element, needToManualDestroy)->
            new directives.api.models.child.WindowChildModel scope, opts, isIconVisibleOnClick,
                mapCtrl, markerCtrl, $http, $templateCache, $compile, element, needToManualDestroy

        angular.module('mockModule', [])
        .value('isIconVisibleOnClick', true)
        .value('mapCtrl', document.gMap)
        .value('markerCtrl', @gMarker)
        .value('opts', @windowOpts)
        .value('element', '<span>hi</span>')
        .value('needToManualDestroy', false)
        .controller('childModel', create)

        angular.mock.module('mockModule')


    describe "Standard", ->
        beforeEach ->
            inject(($http, $rootScope, $templateCache, $compile, $controller) =>
                scope = $rootScope.$new()
                _.extend(@scope, scope)
                @subject = $controller('childModel', scope: scope)
            )

        it 'can be created', ->
            expect(@subject != undefined).toEqual(true)
            expect(@subject.index).toEqual(@index)


    describe "InfoBox-Variant", ->
        #mock for googles InfoBox
        #see http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/src/infobox.js
        #for original source
        # @TODO: find out, if there is a better way than using window?
        beforeEach ->
            if window.InfoBox
                jasmine.error('InfoBox is allready defined')
            else
                window.InfoBox = (opt_opts) ->
                    opt_opts = opt_opts || {}
                    @boxClass_ = opt_opts.boxClass || "infoBox"
                    @content_ = opt_opts.content || "";
                    @div_ = document.createElement("div")
                    @div_.className = @boxClass_
                    @subject = opt_opts.subject
            return

            inject(($http, $rootScope, $templateCache, $compile, $controller) =>
                scope = $rootScope.$new()
                @scope.boxClass = 'test'
                _.extend(@scope, scope)
                @subject = $controller('childModel', scope: scope)
            )

        afterEach ->
                # remove InfoBox again
                window.InfoBox = undefined


        it 'can be created', ->
            expect(@subject != undefined).toEqual(true)
            expect(@subject.index).toEqual(@index)

        it 'does have a custom class', ->
            expect(@boxClass != undefined).toEqual(true)
            expect(@div_.className != undefined).toEqual(true)


