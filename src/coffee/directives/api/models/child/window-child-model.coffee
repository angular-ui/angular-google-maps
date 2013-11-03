@ngGmapModule "directives.api.models.child", ->
    class @WindowChildModel extends oo.BaseObject
        constructor: (scope, opts, isIconVisibleOnClick, mapCtrl, markerCtrl, $http, $templateCache, $compile, needToManualDestroy = false)->
            @scope = scope
            @opts = opts
            @mapCtrl = mapCtrl
            @markerCtrl = markerCtrl
            @isIconVisibleOnClick = isIconVisibleOnClick
            @initialMarkerVisibility = if @markerCtrl? then @markerCtrl.getVisible() else false
            @$log = directives.api.utils.Logger
            @$http = $http
            @$templateCache = $templateCache
            @$compile = $compile
            @gWin = new google.maps.InfoWindow(opts)
            # Open window on click
            @markerCtrl.setClickable(true) if @markerCtrl?

            @handleClick()
            @watchShow()
            @watchCoords()
            @needToManualDestroy = needToManualDestroy
            @$log.info(@)

        watchShow: () =>
            @scope.$watch('show', (newValue, oldValue) =>
                if (newValue != oldValue)
                    if (newValue)
                        @showWindow()
                    else
                        @hideWindow()
                else
                    if (newValue and !@gWin.getMap())
                        # If we're initially showing the marker and it's not yet visible, show it.
                        @showWindow()
            , true)

        watchCoords: ()=>
            @scope.$watch('coords', (newValue, oldValue) =>
                if (newValue != oldValue)
                    @gWin.setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude))
            , true)

        handleClick: ()=>
            # Show the window and hide the marker on click
            if @markerCtrl?
                google.maps.event.addListener(@markerCtrl, 'click', =>
                    pos = @markerCtrl.getPosition()
                    @gWin.setPosition(pos)
                    @gWin.open(@mapCtrl)
                    @markerCtrl.setVisible(@isIconVisibleOnClick)
                )
            # Set visibility of marker back to what it was before opening the window
            google.maps.event.addListener(@gWin, 'closeclick', =>
                if @markerCtrl?
                    @markerCtrl.setVisible(@initialMarkerVisibility)
                @scope.closeClick() if @scope.closeClick?
            )

        showWindow: () =>
            if @scope.templateUrl
                @$http.get(@scope.templateUrl, { cache: @$templateCache }).then((content) =>
                    templateScope = @scope.$new()
                    if angular.isDefined(@scope.templateParameter)
                        templateScope.parameter = @scope.templateParameter
                    compiled = @$compile(content.data)(templateScope)
                    @gWin.setContent(compiled.get(0))
                    @gWin.open(@mapCtrl)
                )
            else
                @gWin.open(@mapCtrl)

        hideWindow: () =>
            @gWin.close()

        destroy: ()=>
            @hideWindow(@gWin)
            if(@scope? and @needToManualDestroy)
                @scope.$destroy()
            delete @gWin
            self = undefined

