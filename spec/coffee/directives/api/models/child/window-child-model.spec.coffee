describe 'uiGmapWindowChildModel', ->
    beforeEach ->

        mock = window['uiGmapInitiator'].initMock()

        if window.InfoBox
            @infoBoxRealTemp = window.InfoBox
        else
            window.InfoBox = (opt_opts) ->
                opt_opts = opt_opts || {}
                @boxClass_ = opt_opts.boxClass || 'infoBox'
                @content_ = opt_opts.content || '';
                @div_ = document.createElement('div')
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
        #constructor: (@model, @scope, @opts, @isIconVisibleOnClick, @mapCtrl, @markerScope,
        #@element, @needToManualDestroy = false, @markerIsVisibleAfterWindowClose = true) ->

        inject ($rootScope, uiGmapWindowChildModel) =>
          scope = $rootScope.$new()
          isIconVisibleOnClick = true
          model = _.extend @scope, scope
          mapCtrl = document.gMap
          @gMarker

          @subject =
            new uiGmapWindowChildModel model, scope, @windowOpts, isIconVisibleOnClick, mapCtrl, undefined, '<span>hi</span>'

    it 'can be created', ->
        expect(@subject).toBeDefined()
        expect(@subject.index).toEqual(@index)
