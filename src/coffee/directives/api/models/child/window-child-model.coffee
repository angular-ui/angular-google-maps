angular.module('uiGmapgoogle-maps.directives.api.models.child')
.factory 'uiGmapWindowChildModel',
  ['uiGmapBaseObject', 'uiGmapGmapUtil', 'uiGmapLogger', '$compile', '$http', '$templateCache',
    'uiGmapChromeFixes', 'uiGmapEventsHelper',
    (BaseObject, GmapUtil, $log, $compile, $http, $templateCache, ChromeFixes, EventsHelper) ->
      class WindowChildModel extends BaseObject
        @include GmapUtil
        @include EventsHelper
        constructor: (@model, @scope, @opts, @isIconVisibleOnClick, @mapCtrl, @markerScope, @element,
          @needToManualDestroy = false, @markerIsVisibleAfterWindowClose = true) ->

          @getGmarker = ->
            @markerScope?.getGMarker() if @markerScope?['getGMarker']?

          @listeners = []
          @createGWin()

          @getGmarker().setClickable(true) if @getGmarker()?

          @watchElement()
          @watchOptions()
          @watchCoords()

          @watchAndDoShow()
          @scope.$on '$destroy', =>
            @destroy()
          $log.info @
        #todo: watch model in here, and recreate / clean gWin on change

        doShow: =>
          if @scope.show
            @showWindow()
          else
            @hideWindow()

        watchAndDoShow: =>
          @scope.show = @model.show if @model.show?
          @scope.$watch 'show', @doShow, true
          @doShow()

        watchElement: =>
          @scope.$watch =>
            return unless @element or @html
            if @html isnt @element.html() and @gWin
              @opts?.content = undefined
              wasOpen = @gWin.isOpen()
              @remove()
              @createGWin(wasOpen)

        createGWin: (isOpen = false) =>
          unless @gWin?
            defaults = {}
            if @opts?
              #being double careful for race condition on @opts.position via watch coords (if element and coords change at same time)
              @opts.position = @getCoords @scope.coords if @scope.coords
              defaults = @opts
            if @element
              @html = if _.isObject(@element) then @element.html() else @element
            _opts = if @scope.options then @scope.options else defaults
            @opts = @createWindowOptions @getGmarker(), @markerScope or @scope, @html, _opts

          if @opts? and !@gWin
            if @opts.boxClass and (window.InfoBox and typeof window.InfoBox is 'function')
              @gWin = new window.InfoBox @opts
            else
              @gWin = new google.maps.InfoWindow @opts
            @handleClick(@scope?.options?.forceClick or isOpen)
            @doShow()

            # Set visibility of marker back to what it was before opening the window
            @listeners.push google.maps.event.addListener @gWin, 'closeclick', =>
              if @getGmarker()
                @getGmarker().setAnimation @oldMarkerAnimation
                if @markerIsVisibleAfterWindowClose
                  _.delay => #appears to help animation chrome bug
                    @getGmarker().setVisible false
                    @getGmarker().setVisible @markerIsVisibleAfterWindowClose
                  , 250
              @gWin.close()
              @model.show = false
              if @scope.closeClick?
                @scope.$evalAsync @scope.closeClick()
              else
                #update models state change since it is out of angular scope (closeClick)
                @scope.$evalAsync()

        watchCoords: =>
          scope = if @markerScope? then @markerScope else @scope
          scope.$watch 'coords', (newValue, oldValue) =>
            if newValue isnt oldValue
              unless newValue?
                @hideWindow()
              else if !@validateCoords newValue
                $log.error "WindowChildMarker cannot render marker as scope.coords as no position on marker: #{JSON.stringify @model}"
                return
              pos = @getCoords newValue
              @gWin.setPosition pos
              @opts.position = pos if @opts
          , true

        watchOptions: =>
          #windows and markers options are separate
          @scope.$watch 'options', (newValue, oldValue) =>
            if newValue isnt oldValue
              @opts = newValue
              if @gWin?
                @gWin.setOptions @opts

                if @opts.visible? and @opts.visible
                  @showWindow()
                else if @opts.visible?
                  @hideWindow()

          , true

        handleClick: (forceClick) =>
          return unless @gWin?
          # Show the window and hide the marker on click
          marker = @getGmarker()
          click = =>
            @createGWin() unless @gWin?
            @showWindow()
            if marker?
              @initialMarkerVisibility = marker.getVisible()
              @oldMarkerAnimation = marker.getAnimation()
              marker.setVisible @isIconVisibleOnClick

          click() if forceClick
          if marker
            @listeners = @listeners.concat @setEvents marker, {events: {click: click}}, @model

        showWindow: =>
          if @gWin?
            show = =>
              @scope.$evalAsync =>
                unless @gWin.isOpen()
                  maybeMarker = @getGmarker()
                  pos = @gWin.getPosition() if @gWin? and @gWin.getPosition?
                  pos = maybeMarker.getPosition() if maybeMarker
                  maybeAnchor = @getGmarker()
                  return unless pos
                  @gWin.open @mapCtrl, maybeAnchor
                  isOpen = @gWin.isOpen()
                  @scope.$evalAsync =>
                    ChromeFixes.maybeRepaint @gWin.content
                  @model.show = isOpen if @model.show != isOpen

            if @scope.templateUrl
              $http.get(@scope.templateUrl, { cache: $templateCache }).then (content) =>
                templateScope = @scope.$new()
                if angular.isDefined @scope.templateParameter
                  templateScope.parameter = @scope.templateParameter
                compiled = $compile(content.data) templateScope
                @gWin.setContent compiled[0]
                show()

            else if @scope.template
              templateScope = @scope.$new()
              if angular.isDefined(@scope.templateParameter)
                templateScope.parameter = @scope.templateParameter
              compiled = $compile(@scope.template) templateScope
              @gWin.setContent compiled[0]
              show()
            else
              show()

        hideWindow: =>
          @gWin.close() if @gWin? and @gWin.isOpen()

        getLatestPosition: (overridePos) =>
          if @gWin? and @getGmarker()? and not overridePos
            @gWin.setPosition @getGmarker().getPosition()
          else
            @gWin.setPosition overridePos if overridePos

        remove: =>
          @hideWindow()
          @removeEvents @listeners
          @listeners.length = 0
          delete @gWin
          delete @opts

        destroy: (manualOverride = false)=>
          @remove()
          if @scope? and not @scope?.$$destroyed and (@needToManualDestroy or manualOverride)
            @scope.$destroy()

      WindowChildModel
  ]
