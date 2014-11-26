angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapPolylineChildModel', [
  'uiGmapPolylineOptionsBuilder', 'uiGmapLogger', '$timeout',
  'uiGmaparray-sync', 'uiGmapGmapUtil', 'uiGmapEventsHelper'
  (Builder, $log, $timeout, arraySync, GmapUtil, EventsHelper) ->
    class PolylineChildModel extends Builder
      @include GmapUtil
      @include EventsHelper
      constructor: (@scope, @attrs, @map, @defaults, @model) ->
        @isDragging = false
        @internalEvents =
          dragend: =>
            # allow the lock of dragging to overrun slightly to make sure nothing is created unnecessarily
            _.defer =>
              @isDragging = false
          dragstart: =>
            @isDragging = true

        create = =>
          return if @isDragging #avoid unnecessary creation (be nice if we knew we were editing too)
          pathPoints = @convertPathPoints @scope.path
          if @polyline?
            @clean()
          @polyline = new google.maps.Polyline @buildOpts pathPoints if pathPoints.length > 0
          if @polyline
            @extendMapBounds map, pathPoints if @scope.fit
            arraySync @polyline.getPath(), @scope, 'path', (pathPoints) =>
              @extendMapBounds map, pathPoints if @scope.fit
            @listeners = if @model then @setEvents @polyline, @scope, @model else @setEvents @polyline, @scope, @scope
            @internalListeners = if @model then @setEvents @polyline, events: @internalEvents, @model else @setEvents @polyline, events: @internalEvents, @scope

        create() #handle stuff without being dependent on digests (ie using watches for init)

        scope.$watch 'path', (newValue, oldValue) =>
          if not _.isEqual(newValue, oldValue) or not @polyline
            create()
        , true
        #TODO refactor all these sets and watches to be handled functionally as an array
        #Begin Booleans
        if !scope.static and angular.isDefined(scope.editable)
          scope.$watch 'editable', (newValue, oldValue) =>
            if newValue isnt oldValue
              newValue = not @isFalse newValue
              @polyline?.setEditable newValue
          , true
        if angular.isDefined scope.draggable
          scope.$watch 'draggable', (newValue, oldValue) =>
            if newValue isnt oldValue
              newValue = not @isFalse newValue
              @polyline?.setDraggable newValue
          , true
        if angular.isDefined scope.visible
          scope.$watch 'visible', (newValue, oldValue) =>
            if newValue isnt oldValue
              newValue = not @isFalse newValue
            @polyline?.setVisible newValue
          , true
        if angular.isDefined scope.geodesic
          scope.$watch 'geodesic', (newValue, oldValue) =>
            if newValue isnt oldValue
              newValue = not @isFalse newValue
              @polyline?.setOptions @buildOpts(@polyline.getPath())
          , true
        #End Booleans

        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.weight)
          scope.$watch 'stroke.weight', (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue isnt oldValue
          , true
        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.color)
          scope.$watch 'stroke.color', (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue isnt oldValue
          , true
        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.opacity)
          scope.$watch 'stroke.opacity', (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue isnt oldValue
          , true
        if angular.isDefined(scope.icons)
          scope.$watch 'icons', (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue isnt oldValue
          , true
        # Remove @polyline on scope $destroy
        scope.$on '$destroy', =>
          @clean()
          @scope = null

        $log.info @

      clean: =>
        @removeEvents @listeners
        @removeEvents @internalListeners
#        @removeEvents @internalPathListeners
        @polyline?.setMap null
        @polyline = null
]
