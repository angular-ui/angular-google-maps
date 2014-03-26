@ngGmapModule "directives.api.models.child", ->
    class @WindowChildModel extends oo.BaseObject
        @include directives.api.utils.GmapUtil
        constructor: (scope, opts, isIconVisibleOnClick, mapCtrl, markerCtrl, $http, $templateCache, $compile, @element, needToManualDestroy = false)->
            @scope = scope
            @googleMapsHandles = []
            @opts = opts
            @mapCtrl = mapCtrl
            @markerCtrl = markerCtrl
            @isIconVisibleOnClick = isIconVisibleOnClick
            @initialMarkerVisibility = if @markerCtrl? then @markerCtrl.getVisible() else false
            @$log = directives.api.utils.Logger
            @$http = $http
            @$templateCache = $templateCache
            @$compile = $compile
            @createGWin()
            # Open window on click
            @markerCtrl.setClickable(true) if @markerCtrl?

            @handleClick()
            @watchShow()
            @watchCoords()
            @needToManualDestroy = needToManualDestroy
            @$log.info(@)


        createGWin:() =>
            if !@gWin? and @markerCtrl?
                defaults = if @opts? then @opts else {}
                html = if @element? and _.isFunction(@element.html) then @element.html() else @element
                @opts = if @markerCtrl? then @createWindowOptions(@markerCtrl, @scope, html, defaults) else {}

            if @opts? and @gWin == undefined
                if @opts.boxClass and (window.InfoBox && typeof window.InfoBox == 'function')
                    @gWin = new window.InfoBox(@opts)
                else
                    @gWin = new google.maps.InfoWindow(@opts)

                # Set visibility of marker back to what it was before opening the window
                @googleMapsHandles.push google.maps.event.addListener @gWin, 'closeclick', =>
                    if @markerCtrl?
                        @markerCtrl.setVisible(@initialMarkerVisibility)
                    @gWin.isOpen(false)

                    @scope.closeClick() if @scope.closeClick?

        watchShow: () =>
            @scope.$watch 'show', (newValue, oldValue) =>
                if (newValue)
                    @showWindow()
                else
                    @hideWindow()

        watchCoords: ()=>
            scope = if @markerCtrl? then @scope.$parent else @scope
            scope.$watch('coords', (newValue, oldValue) =>
                if (newValue != oldValue)
                    unless newValue?
                        @hideWindow()
                    else
                        if !newValue.latitude? or !newValue.longitude?
                            @$log.error "WindowChildMarker cannot render marker as scope.coords as no position on marker: #{JSON.stringify @model}"
                            return
                        @gWin.setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude))
            , true)

        handleClick: ()=>
            # Show the window and hide the marker on click
            if @markerCtrl?
                @googleMapsHandles.push google.maps.event.addListener @markerCtrl, 'click', =>
                    @createGWin() unless @gWin?
                    pos = @markerCtrl.getPosition()
                    if @gWin?
                        @gWin.setPosition(pos)
                        @showWindow()
                    @initialMarkerVisibility = @markerCtrl.getVisible()
                    @markerCtrl.setVisible(@isIconVisibleOnClick)

        showWindow: () =>
            show = () =>
                if @gWin
                    if (@scope.show || !@scope.show?) and !@gWin.isOpen() #only show if we have no show defined yet or if show is really true
                        @gWin.open(@mapCtrl)
            if @scope.templateUrl
                if @gWin
                    @$http.get(@scope.templateUrl, { cache: @$templateCache }).then((content) =>
                        templateScope = @scope.$new()
                        if angular.isDefined(@scope.templateParameter)
                            templateScope.parameter = @scope.templateParameter
                        compiled = @$compile(content.data)(templateScope)
                        @gWin.setContent(compiled[0])
                        show()
                    )
            else
                show()

        getLatestPosition:() =>
            @gWin.setPosition @markerCtrl.getPosition() if @gWin? and @markerCtrl?

        hideWindow: () =>
            @gWin.close() if @gWin? and @gWin.isOpen()

        destroy: ()=>
            @hideWindow()
            _.each @googleMapsHandles, (h) ->
                google.maps.event.removeListener h
            @googleMapsHandles.length = 0
            if @scope? and @needToManualDestroy
                @scope.$destroy()
            delete @gWin
            self = undefined

