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

          #where @model is a reference to model in the controller scope
          #clonedModel is a copy for comparison
          @clonedModel = _.clone @model, true

          @getGmarker = ->
            @markerScope?.getGMarker() if @markerScope?['getGMarker']?

          @listeners = []
          @createGWin()

          maybeMarker = @getGmarker()
          maybeMarker.setClickable(true) if maybeMarker?

          @watchElement()
          @watchOptions()
          @watchCoords()

          @watchAndDoShow()
          @scope.$on '$destroy', =>
            @destroy()
          $log.info @
        #todo: watch model in here, and recreate / clean gObject on change

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
            if @html isnt @element.html() and @gObject
              @opts?.content = undefined
              wasOpen = @gObject.isOpen()
              @remove()
              @createGWin(wasOpen)

        createGWin: (isOpen = false) =>
          maybeMarker = @getGmarker()
          unless @gObject?
            defaults = {}
            if @opts?
              #being double careful for race condition on @opts.position via watch coords (if element and coords change at same time)
              @opts.position = @getCoords @scope.coords if @scope.coords
              defaults = @opts
            if @element
              @html = if _.isObject(@element) then @element.html() else @element
            _opts = if @scope.options then @scope.options else defaults
            @opts = @createWindowOptions maybeMarker, @markerScope or @scope, @html, _opts

          if @opts? and !@gObject
            if @opts.boxClass and (window.uiGmapInfoBox and typeof window.uiGmapInfoBox is 'function')
              @gObject = new window.uiGmapInfoBox @opts
            else
              @gObject = new google.maps.InfoWindow @opts
            @handleClick(@scope?.options?.forceClick or isOpen)
            @doShow()

            # Set visibility of marker back to what it was before opening the window
            @listeners.push google.maps.event.addListener @gObject, 'domready', ->
              ChromeFixes.maybeRepaint @content

            @listeners.push google.maps.event.addListener @gObject, 'closeclick', =>
              if maybeMarker
                maybeMarker.setAnimation @oldMarkerAnimation
                if @markerIsVisibleAfterWindowClose
                  _.delay => #appears to help animation chrome bug
                    maybeMarker.setVisible false
                    maybeMarker.setVisible @markerIsVisibleAfterWindowClose
                  , 250
              @gObject.close()
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
              @doShow()
              @gObject.setPosition pos
              @opts.position = pos if @opts
          , true

        watchOptions: =>
          #windows and markers options are separate
          @scope.$watch 'options', (newValue, oldValue) =>
            if newValue isnt oldValue
              @opts = newValue
              if @gObject?
                @gObject.setOptions @opts

                if @opts.visible? and @opts.visible
                  @showWindow()
                else if @opts.visible?
                  @hideWindow()

          , true

        handleClick: (forceClick) =>
          return unless @gObject?
          # Show the window and hide the marker on click
          maybeMarker = @getGmarker()
          click = =>
            @createGWin() unless @gObject?
            @showWindow()
            if maybeMarker?
              @initialMarkerVisibility = maybeMarker.getVisible()
              @oldMarkerAnimation = maybeMarker.getAnimation()
              maybeMarker.setVisible @isIconVisibleOnClick

          click() if forceClick
          if maybeMarker
            @listeners = @listeners.concat @setEvents maybeMarker, {events: {click: click}}, @model

        showWindow: =>
          if @gObject?
            show = =>
              unless @gObject.isOpen()
                maybeMarker = @getGmarker()
                pos = @gObject.getPosition() if @gObject? and @gObject.getPosition?
                pos = maybeMarker.getPosition() if maybeMarker
                return unless pos
                @gObject.open @mapCtrl, maybeMarker
                isOpen = @gObject.isOpen()
                @model.show = isOpen if @model.show != isOpen

            if @scope.templateUrl
              $http.get(@scope.templateUrl, { cache: $templateCache }).then (content) =>
                templateScope = @scope.$new()
                if angular.isDefined @scope.templateParameter
                  templateScope.parameter = @scope.templateParameter
                compiled = $compile(content.data) templateScope
                @gObject.setContent compiled[0]
                show()

            else if @scope.template
              templateScope = @scope.$new()
              if angular.isDefined(@scope.templateParameter)
                templateScope.parameter = @scope.templateParameter
              compiled = $compile(@scope.template) templateScope
              @gObject.setContent compiled[0]
              show()
            else
              show()

        hideWindow: =>
          @gObject.close() if @gObject? and @gObject.isOpen()

        getLatestPosition: (overridePos) =>
          maybeMarker = @getGmarker()
          if @gObject? and maybeMarker? and not overridePos
            @gObject.setPosition maybeMarker.getPosition()
          else
            @gObject.setPosition overridePos if overridePos

        remove: =>
          @hideWindow()
          @removeEvents @listeners
          @listeners.length = 0
          delete @gObject
          delete @opts

        destroy: (manualOverride = false)=>
          @remove()
          if @scope? and not @scope?.$$destroyed and (@needToManualDestroy or manualOverride)
            @scope.$destroy()

      WindowChildModel
  ]
