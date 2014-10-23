angular.module("google-maps.directives.api.models.child".ns())
.factory "WindowChildModel".ns(),
  [ "BaseObject".ns(), "GmapUtil".ns(), "Logger".ns(), "$compile", "$http", "$templateCache",
    (BaseObject, GmapUtil, $log, $compile, $http, $templateCache) ->
      class WindowChildModel extends BaseObject
        @include GmapUtil
        constructor: (@model, @scope, @opts, @isIconVisibleOnClick,
          @mapCtrl, @markerScope, @element, @needToManualDestroy = false, @markerIsVisibleAfterWindowClose = true) ->

          @getGmarker = ->
            @markerScope?.getGMarker() if @markerScope?['getGMarker']?

          @googleMapsHandles = []
          @createGWin()

          @getGmarker().setClickable(true) if @getGmarker()?

          @watchElement()
          @watchOptions()
          @watchCoords()

          @watchAndDoShow()
          @scope.$on "$destroy", =>
            @destroy()
          $log.info @
          #todo: watch model in here, and recreate / clean gWin on change

        doShow: =>
            @showWindow() if @scope.show

        watchAndDoShow: =>
          @scope.show = @model.show if @model.show?
          @scope.$watch 'show', @doShow, true
          @doShow()

        watchElement: =>
          @scope.$watch =>
            return if not @element or not @html
            if @html != @element.html() #has content changed?
              if @gWin
                @opts?.content = undefined
                @remove()
                @createGWin()

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
              @opts = @createWindowOptions(@getGmarker(), @markerScope || @scope, @html, _opts)

          if @opts? and !@gWin
            if @opts.boxClass and (window.InfoBox && typeof window.InfoBox == 'function')
              @gWin = new window.InfoBox(@opts)
            else
              @gWin = new google.maps.InfoWindow(@opts)
            @handleClick(@scope?.options?.forceClick)
            @doShow()

            # Set visibility of marker back to what it was before opening the window
            @googleMapsHandles.push google.maps.event.addListener @gWin, 'closeclick', =>
              if @getGmarker()
                @getGmarker().setAnimation @oldMarkerAnimation
                if @markerIsVisibleAfterWindowClose
                  _.delay => #appears to help animation chrome bug
                    @getGmarker().setVisible false
                    @getGmarker().setVisible @markerIsVisibleAfterWindowClose
                  , 250
              @gWin.isOpen(false)
              @model.show = false
              if @scope.closeClick?
                @scope.$apply(@scope.closeClick())
              else
                #update models state change since it is out of angular scope (closeClick)
                @scope.$apply()

        watchCoords: ()=>
            scope = if @markerScope? then @markerScope else @scope
            scope.$watch('coords', (newValue, oldValue) =>
                if (newValue != oldValue)
                    unless newValue?
                        @hideWindow()
                    else
                        if !@validateCoords(newValue)
                            $log.error "WindowChildMarker cannot render marker as scope.coords as no position on marker: #{JSON.stringify @model}"
                            return
                        pos = @getCoords(newValue)
                        @gWin.setPosition pos
                        @opts.position = pos if @opts
            , true)

        watchOptions: ()=>
            #windows and markers options are separate
            @scope.$watch('options', (newValue, oldValue) =>
                if (newValue != oldValue)
                    @opts = newValue
                    if @gWin?
                        @gWin.setOptions(@opts)

                        if @opts.visible? && @opts.visible
                          @showWindow()
                        else if @opts.visible?
                          @hideWindow()

            , true)

        handleClick: (forceClick)=>
          return unless @gWin?
          # Show the window and hide the marker on click
          click = =>
            @createGWin() unless @gWin?
            pos = if @scope.coords? then @gWin.getPosition() else @getGmarker().getPosition()
            if @gWin?
              @gWin.setPosition(pos)
              @opts.position = pos if @opts
              @showWindow()
            if @getGmarker()?
              @initialMarkerVisibility = @getGmarker().getVisible()
              @oldMarkerAnimation = @getGmarker().getAnimation()
              @getGmarker().setVisible(@isIconVisibleOnClick)
          click() if forceClick

          if @getGmarker()
            @googleMapsHandles.push google.maps.event.addListener @getGmarker(), 'click', click

        showWindow: () =>
          show = () =>
            if @gWin?
              unless @gWin.isOpen() #only show if we have no show defined yet or if show is really true
                @gWin.open(@mapCtrl, if @getGmarker() then @getGmarker() else undefined)
                @model.show = @gWin.isOpen()
                # $log.debug "window for marker.key (#{@markerCtrl.key}) opened" if @markerCtrl

          if @scope.templateUrl
            if @gWin?
              $http.get(@scope.templateUrl, { cache: $templateCache }).then (content) =>
                templateScope = @scope.$new()
                if angular.isDefined(@scope.templateParameter)
                  templateScope.parameter = @scope.templateParameter
                compiled = $compile(content.data)(templateScope)
                @gWin.setContent(compiled[0])
          else if @scope.template
            if @gWin?
              templateScope = @scope.$new()
              if angular.isDefined(@scope.templateParameter)
                templateScope.parameter = @scope.templateParameter
              compiled = $compile(@scope.template)(templateScope)
              @gWin.setContent(compiled[0])
          show()

        hideWindow: () =>
          @gWin.close() if @gWin? and @gWin.isOpen()

        getLatestPosition: (overridePos) =>
          if @gWin? and @getGmarker()? and not overridePos
            @gWin.setPosition @getGmarker().getPosition()
          else
            @gWin.setPosition overridePos if overridePos

        remove: =>
          @hideWindow()
          _.each @googleMapsHandles, (h) ->
            google.maps.event.removeListener h
          @googleMapsHandles.length = 0
          delete @gWin
          delete @opts

        destroy: (manualOverride = false)=>
          @remove()
          if @scope? and @scope?.$$destroyed and (@needToManualDestroy or manualOverride)
            @scope.$destroy()
          self = undefined

        getGWin: =>
          @gWin

      WindowChildModel
  ]
