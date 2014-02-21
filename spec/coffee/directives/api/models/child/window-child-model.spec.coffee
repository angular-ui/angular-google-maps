describe "WindowChildModel", ->
    beforeEach ->
        if window.InfoBox
            @infoBoxRealTemp = window.InfoBox
        else
            window.InfoBox = (opt_opts) ->
                opt_opts = opt_opts || {}
                @boxClass_ = opt_opts.boxClass || "infoBox"
                @content_ = opt_opts.content || "";
                @div_ = document.createElement("div")
                @div_.className = @boxClass_
                
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
        angular.module('mockModule', ["google-maps"])
        .value('isIconVisibleOnClick', true)
        .value('model', @scope)
        .value('mapCtrl', document.gMap)
        .value('markerCtrl', @gMarker)
        .value('opts', @windowOpts)
        .value('element', '<span>hi</span>')
        .value('needToManualDestroy', false)
        .value('markerIsVisibleAfterWindowClose', true)
        .controller 'childModel', (WindowChildModel) ->
                WindowChildModel

        angular.mock.module('mockModule')

    it 'can be created', ->
        inject(($http, $rootScope, $templateCache, $compile, $controller) =>
            scope = $rootScope.$new()
            _.extend(@scope, scope)
            @subject = $controller('childModel', scope: scope)
        )
        expect(@subject != undefined).toEqual(true)
        expect(@subject.index).toEqual(@index)

    it 'can be created with the infoBoxplugin', ->
        inject(($http, $rootScope, $templateCache, $compile, $controller) =>
            scope = $rootScope.$new()
            _.extend(@scope, scope)
            @subject = $controller('childModel', scope: scope)
        )
        expect(@subject != undefined).toEqual(true)
        expect(@subject.index).toEqual(@index)