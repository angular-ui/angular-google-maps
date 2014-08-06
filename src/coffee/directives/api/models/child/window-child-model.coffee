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

                    @markerCtrl.setClickable(true) if @markerCtrl?

                    @watchElement()
                    @watchOptions()
                    @watchShow()
                    @watchCoords()
                    @scope.$on "$destroy", =>
                      @destroy()
                    @$log.info(@)
                    #todo: watch model in here, and recreate / clean gWin on change

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
                        _opts = if @scope.options then @scope.options else defaults
                        @opts = @createWindowOptions(@markerCtrl, @scope, @html, _opts)

                    if @opts? and !@gWin
                        if @opts.boxClass and (window.InfoBox && typeof window.InfoBox == 'function')
                            @gWin = new window.InfoBox(@opts)
                        else
                            @gWin = new google.maps.InfoWindow(@opts)
                        @handleClick() if @gWin

                        # Set visibility of marker back to what it was before opening the window
                        @googleMapsHandles.push google.maps.event.addListener @gWin, 'closeclick', =>
                            if @markerCtrl
                              @markerCtrl.setAnimation @oldMarkerAnimation
                              if @markerIsVisibleAfterWindowClose
                                _.delay => #appears to help animation chrome bug
                                  @markerCtrl.setVisible false
                                  @markerCtrl.setVisible @markerIsVisibleAfterWindowClose
                                ,250
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

                watchOptions: ()=>
                    scope = if @markerCtrl? then @scope.$parent else @scope
                    scope.$watch('options', (newValue, oldValue) =>
                        if (newValue != oldValue)
                            @opts = newValue
                            if @gWin?
                                @gWin.setOptions(@opts)
                    , true)

                handleClick: (forceClick)=>
                    # Show the window and hide the marker on click
                    click = =>
                        @createGWin() unless @gWin?
                        pos = @markerCtrl.getPosition()
                        if @gWin?
                            @gWin.setPosition(pos)
                            @opts.position = pos if @opts
                            @showWindow()
                        @initialMarkerVisibility = @markerCtrl.getVisible()
                        @oldMarkerAnimation = @markerCtrl.getAnimation()
                        @markerCtrl.setVisible(@isIconVisibleOnClick)

                    if @markerCtrl?
                        click() if forceClick
                        @googleMapsHandles.push google.maps.event.addListener @markerCtrl, 'click', click


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
                    if @scope.show || !@scope.show?
                        @showWindow()
                    else
                        @hideWindow()

                getLatestPosition: (overridePos) =>
                    if @gWin? and @markerCtrl? and not overridePos
                        @gWin.setPosition @markerCtrl.getPosition()
                    else
                      @gWin.setPosition overridePos if overridePos

                hideWindow: () =>
                  @gWin.close() if @gWin? and @gWin.isOpen()

                remove: =>
                  @hideWindow()
                  _.each @googleMapsHandles, (h) ->
                    google.maps.event.removeListener h
                  @googleMapsHandles.length = 0
                  delete @gWin
                  delete @opts

                destroy: (manualOverride = false)=>
                    @remove()
                    if @scope? and (@needToManualDestroy or manualOverride)
                        @scope.$destroy()
                    self = undefined

            WindowChildModel
    ]
