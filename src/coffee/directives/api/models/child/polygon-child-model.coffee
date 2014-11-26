angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapPolygonChildModel', [
  'uiGmapPolygonOptionsBuilder', 'uiGmapLogger', '$timeout',
  'uiGmaparray-sync', 'uiGmapGmapUtil', 'uiGmapEventsHelper'
  (Builder, $log, $timeout,
  arraySync, GmapUtil, EventsHelper) ->
    class PolygonChildModel extends Builder
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
          if @polygon?
            @clean()
          @polygon = new google.maps.Polygon @buildOpts pathPoints if pathPoints.length > 0
          if @polygon
            @extendMapBounds map, pathPoints if @scope.fit
            arraySync @polygon.getPath(), @scope, 'path', (pathPoints) =>
              @extendMapBounds map, pathPoints if @scope.fit
            @listeners = if @model then @setEvents @polygon, @scope, @model else @setEvents @polygon, @scope, @scope
            @internalListeners = if @model then @setEvents @polygon, events: @internalEvents, @model else @setEvents @polygon, events: @internalEvents, @scope

        create() #handle stuff without being dependent on digests (ie using watches for init)

        scope.$watch 'path', (newValue, oldValue) =>
          if not _.isEqual(newValue, oldValue) or not @polygon
            create()
        , true
        #TODO refactor all these sets and watches to be handled functionally as an array
        #Begin Booleans
        if !scope.static and angular.isDefined(scope.editable)
          scope.$watch 'editable', (newValue, oldValue) =>
            if newValue isnt oldValue
              newValue = not @isFalse newValue
              @polygon?.setEditable newValue
          , true
        if angular.isDefined scope.draggable
          scope.$watch 'draggable', (newValue, oldValue) =>
            if newValue isnt oldValue
              newValue = not @isFalse newValue
              @polygon?.setDraggable newValue
          , true
        if angular.isDefined scope.visible
          scope.$watch 'visible', (newValue, oldValue) =>
            if newValue isnt oldValue
              newValue = not @isFalse newValue
            @polygon?.setVisible newValue
          , true
        if angular.isDefined scope.geodesic
          scope.$watch 'geodesic', (newValue, oldValue) =>
            if newValue isnt oldValue
              newValue = not @isFalse newValue
              @polygon?.setOptions @buildOpts(@polygon.getPath())
          , true
        #End Booleans

        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.weight)
          scope.$watch 'stroke.weight', (newValue, oldValue) =>
            @polygon?.setOptions @buildOpts(@polygon.getPath()) if newValue isnt oldValue
          , true
        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.color)
          scope.$watch 'stroke.color', (newValue, oldValue) =>
            @polygon?.setOptions @buildOpts(@polygon.getPath()) if newValue isnt oldValue
          , true
        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.opacity)
          scope.$watch 'stroke.opacity', (newValue, oldValue) =>
            @polygon?.setOptions @buildOpts(@polygon.getPath()) if newValue isnt oldValue
          , true
        if angular.isDefined(scope.icons)
          scope.$watch 'icons', (newValue, oldValue) =>
            @polygon?.setOptions @buildOpts(@polygon.getPath()) if newValue isnt oldValue
          , true
        # Remove @polygon on scope $destroy
        scope.$on '$destroy', =>
          @clean()
          @scope = null

        if angular.isDefined(scope.fill) and angular.isDefined scope.fill.color
          scope.$watch 'fill.color', (newValue, oldValue) =>
            @polygon.setOptions @buildOpts(@polygon.getPath()) if newValue isnt oldValue

        if angular.isDefined(scope.fill) and angular.isDefined scope.fill.opacity
          scope.$watch 'fill.opacity', (newValue, oldValue) =>
            @polygon.setOptions @buildOpts(@polygon.getPath()) if newValue isnt oldValue

        if angular.isDefined scope.zIndex
          scope.$watch 'zIndex', (newValue, oldValue) =>
            @polygon.setOptions @buildOpts(@polygon.getPath()) if newValue isnt oldValue

        if angular.isDefined(scope.events) and scope.events isnt null and angular.isObject scope.events
          @listeners = EventsHelper.setEvents @polygon, scope, scope

      clean: =>
        @removeEvents @listeners
        @removeEvents @internalListeners
        #        @removeEvents @internalPathListeners
        @polygon?.setMap null
        @polygon = null
]
