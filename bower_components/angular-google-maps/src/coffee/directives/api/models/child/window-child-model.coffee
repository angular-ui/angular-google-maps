angular.module("google-maps.directives.api.models.child")
.factory "WindowChildModel", [ "BaseObject", "GmapUtil", "Logger", "$compile", "$http", "$templateCache",
        (BaseObject, GmapUtil, Logger, $compile, $http, $templateCache) ->
            class WindowChildModel extends BaseObject
                @include GmapUtil
                constructor: (@model, @scope, @opts, @isIconVisibleOnClick, @mapCtrl, @markerCtrl,
                              @element, @needToManualDestroy = false, @markerIsVisibleAfterWindowClose = true)->
                    @googleMapsHandles = []
                    @$log = Logger
                    @createGWin()
                    # Open window on click
                    @markerCtrl.setClickable(true) if @markerCtrl?

                    @handleClick()
                    @watchElement()
                    @watchShow()
                    @watchCoords()
                    @$log.info(@)

                watchElement:=>
                    @scope.$watch =>
                        return if not @element or not @html
                        if @html != @element.html() #has content changed?
                            if @gWin
                                @opts?.content = undefined
                                @remove()
                                @createGWin()
                                @showHide()

                createGWin:() =>
                    if !@gWin?
                        defaults = {}
                        if @opts?
                            #being double careful for race condition on @opts.position via watch coords (if element and coords change at same time)
                            @opts.position = @getCoords @scope.coords if @scope.coords
                            defaults = @opts
                        if @element
                          @html = if _.isObject(@element) then @element.html() else @element
                        @opts = @createWindowOptions(@markerCtrl, @scope, @html, defaults)

                    if @opts? and !@gWin
                        if @opts.boxClass and (window.InfoBox && typeof window.InfoBox == 'function')
                            @gWin = new window.InfoBox(@opts)
                        else
                            @gWin = new google.maps.InfoWindow(@opts)

                        # Set visibility of marker back to what it was before opening the window
                        @googleMapsHandles.push google.maps.event.addListener @gWin, 'closeclick', =>
                            @markerCtrl?.setVisible @markerIsVisibleAfterWindowClose
                            @gWin.isOpen(false)
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
                                if !@validateCoords(newValue)
                                    @$log.error "WindowChildMarker cannot render marker as scope.coords as no position on marker: #{JSON.stringify @model}"
                                    return
                                pos = @getCoords(newValue)
                                @gWin.setPosition pos
                                @opts.position = pos if @opts
                    , true)

                handleClick: ()=>
                    # Show the window and hide the marker on click
                    if @markerCtrl?
                        @googleMapsHandles.push google.maps.event.addListener @markerCtrl, 'click', =>
                            @createGWin() unless @gWin?
                            pos = @markerCtrl.getPosition()
                            if @gWin?
                                @gWin.setPosition(pos)
                                @opts.position = pos if @opts
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
                            $http.get(@scope.templateUrl, { cache: $templateCache }).then (content) =>
                                templateScope = @scope.$new()
                                if angular.isDefined(@scope.templateParameter)
                                    templateScope.parameter = @scope.templateParameter
                                compiled = $compile(content.data)(templateScope)
                                @gWin.setContent(compiled[0])
                        show()
                    else
                      show()

                showHide: ->
                    if @scope.show
                        @showWindow()
                    else
                        @hideWindow()

                getLatestPosition: () =>
                    @gWin.setPosition @markerCtrl.getPosition() if @gWin? and @markerCtrl?

                hideWindow: () =>
                  @gWin.close() if @gWin? and @gWin.isOpen()

                remove: =>
                  @hideWindow()
                  _.each @googleMapsHandles, (h) ->
                    google.maps.event.removeListener h
                  @googleMapsHandles.length = 0
                  delete @gWin

                destroy: (manualOverride = false)=>
                    @remove()
                    if @scope? and (@needToManualDestroy or manualOverride)
                        @scope.$destroy()
                    self = undefined

            WindowChildModel
    ]
