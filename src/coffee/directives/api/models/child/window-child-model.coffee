angular.module("google-maps.directives.api.models.child")
.factory "WindowChildModel", [ "BaseObject", "GmapUtil", "Logger", "$compile", "$http", "$templateCache",
        (BaseObject, GmapUtil, Logger, $compile, $http, $templateCache) ->
            class WindowChildModel extends BaseObject
                @include GmapUtil
                constructor: (@model, @scope, @opts, @isIconVisibleOnClick, @mapCtrl, @markerCtrl, @element, @needToManualDestroy = false, @markerIsVisibleAfterWindowClose = true)->
                    @$log = Logger
                    @createGWin()
                    # Open window on click
                    @markerCtrl.setClickable(true) if @markerCtrl?

                    @handleClick()
                    @watchShow()
                    @watchCoords()
                    @$log.info(@)

                createGWin: (createOpts = false) =>
                    if !@gWin? and createOpts and @element? and @element.html?
                        @opts = if @markerCtrl?
                        then @createWindowOptions(@markerCtrl, @scope, @element.html(), {}, @appendContent) else {}

                    if @opts? and @gWin == undefined
                        @gWin = new google.maps.InfoWindow(@opts)

                        # Set visibility of marker back to what it was before opening the window
                        google.maps.event.addListener @gWin, 'closeclick', =>
                            @markerCtrl?.setVisible @markerIsVisibleAfterWindowClose
                        @scope.closeClick() if @scope.closeClick?

                watchShow: () =>
                    @scope.$watch('show', (newValue, oldValue) =>
                        if (newValue != oldValue)
                            if (newValue)
                                @showWindow()
                            else
                                @hideWindow()
                        else
                            if @gWin?
                                if (newValue and !@gWin.getMap())
                                    # If we're initially showing the marker and it's not yet visible, show it.
                                    @showWindow()
                    , true)

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
                        google.maps.event.addListener(@markerCtrl, 'click', =>
                            @createGWin(true) unless @gWin?
                            pos = @markerCtrl.getPosition()
                            if @gWin?
                                @gWin.setPosition(pos)
                                @gWin.open(@mapCtrl)
                            @initialMarkerVisibility = @markerCtrl.getVisible()
                            @markerCtrl.setVisible(@isIconVisibleOnClick)
                        )

                showWindow: () =>
                    if @scope.templateUrl
                        if @gWin
                            $http.get(@scope.templateUrl, { cache: $templateCache }).then((content) =>
                                templateScope = @scope.$new()
                                if angular.isDefined(@scope.templateParameter)
                                    templateScope.parameter = @scope.templateParameter
                                compiled = $compile(content.data)(templateScope)
                                @gWin.setContent(compiled.get(0))
                                @gWin.open(@mapCtrl)
                            )
                    else
                        @gWin.open(@mapCtrl) if @gWin?

                getLatestPosition: () =>
                    @gWin.setPosition @markerCtrl.getPosition() if @gWin? and @markerCtrl?

                hideWindow: () =>
                    @gWin.close() if @gWin?

                destroy: (manualOverride = false)=>
                    @hideWindow(@gWin)
                    #TODO CLEANING UP EVENTS NEEDS TO BE DONE IN MANY OTHER locations in the code base!!
                    # cleaning up events
                    google.maps.event.clearListeners(@markerCtrl, 'click') if @markerCtrl
                    google.maps.event.clearListeners(@gWin, 'closeclick') if @gWin
                    if @scope? and (@needToManualDestroy or manualOverride)
                        @scope.$destroy()
                    delete @gWin
                    self = undefined
            WindowChildModel
    ]
