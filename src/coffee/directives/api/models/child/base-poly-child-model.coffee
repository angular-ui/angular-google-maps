angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapBasePolyChildModel', [
  'uiGmapLogger', '$timeout', 'uiGmaparray-sync', 'uiGmapGmapUtil', 'uiGmapEventsHelper'
  ($log, $timeout, arraySync, GmapUtil, EventsHelper) ->
    (Builder, gFactory) ->
      class BasePolyChildModel extends Builder
        @include GmapUtil
        constructor: (@scope, @attrs, @map, @defaults, @model) ->
          #where @model is a reference to model in the controller scope
          #clonedModel is a copy for comparison
          @clonedModel = _.clone @model, true

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
            if @gObject?
              @clean()
            @gObject = gFactory @buildOpts pathPoints if pathPoints.length > 0
            if @gObject
              @extendMapBounds map, pathPoints if @scope.fit
              arraySync @gObject.getPath(), @scope, 'path', (pathPoints) =>
                @extendMapBounds map, pathPoints if @scope.fit
              if angular.isDefined(scope.events) and angular.isObject scope.events
                @listeners = if @model then EventsHelper.setEvents @gObject, @scope, @model else EventsHelper.setEvents @gObject, @scope, @scope
              @internalListeners = if @model then EventsHelper.setEvents @gObject, events: @internalEvents, @model else EventsHelper.setEvents @gObject, events: @internalEvents, @scope

          create() #handle stuff without being dependent on digests (ie using watches for init)

          scope.$watch 'path', (newValue, oldValue) =>
            if not _.isEqual(newValue, oldValue) or not @gObject
              create()
          , true
          #TODO refactor all these sets and watches to be handled functionally as an array
          #Begin Booleans
          if !scope.static and angular.isDefined(scope.editable)
            scope.$watch 'editable', (newValue, oldValue) =>
              if newValue isnt oldValue
                newValue = not @isFalse newValue
                @gObject?.setEditable newValue
            , true
          if angular.isDefined scope.draggable
            scope.$watch 'draggable', (newValue, oldValue) =>
              if newValue isnt oldValue
                newValue = not @isFalse newValue
                @gObject?.setDraggable newValue
            , true
          if angular.isDefined scope.visible
            scope.$watch 'visible', (newValue, oldValue) =>
              if newValue isnt oldValue
                newValue = not @isFalse newValue
              @gObject?.setVisible newValue
            , true
          if angular.isDefined scope.geodesic
            scope.$watch 'geodesic', (newValue, oldValue) =>
              if newValue isnt oldValue
                newValue = not @isFalse newValue
                @gObject?.setOptions @buildOpts(@gObject.getPath())
            , true
          #End Booleans

          if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.weight)
            scope.$watch 'stroke.weight', (newValue, oldValue) =>
              @gObject?.setOptions @buildOpts(@gObject.getPath()) if newValue isnt oldValue
            , true
          if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.color)
            scope.$watch 'stroke.color', (newValue, oldValue) =>
              @gObject?.setOptions @buildOpts(@gObject.getPath()) if newValue isnt oldValue
            , true
          if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.opacity)
            scope.$watch 'stroke.opacity', (newValue, oldValue) =>
              @gObject?.setOptions @buildOpts(@gObject.getPath()) if newValue isnt oldValue
            , true
          if angular.isDefined(scope.icons)
            scope.$watch 'icons', (newValue, oldValue) =>
              @gObject?.setOptions @buildOpts(@gObject.getPath()) if newValue isnt oldValue
            , true
          # Remove @gObject on scope $destroy
          scope.$on '$destroy', =>
            @clean()
            @scope = null

          if angular.isDefined(scope.fill) and angular.isDefined scope.fill.color
            scope.$watch 'fill.color', (newValue, oldValue) =>
              @gObject.setOptions @buildOpts(@gObject.getPath()) if newValue isnt oldValue

          if angular.isDefined(scope.fill) and angular.isDefined scope.fill.opacity
            scope.$watch 'fill.opacity', (newValue, oldValue) =>
              @gObject.setOptions @buildOpts(@gObject.getPath()) if newValue isnt oldValue

          if angular.isDefined scope.zIndex
            scope.$watch 'zIndex', (newValue, oldValue) =>
              @gObject.setOptions @buildOpts(@gObject.getPath()) if newValue isnt oldValue

        clean: =>
          EventsHelper.removeEvents @listeners
          EventsHelper.removeEvents @internalListeners
          @gObject?.setMap null
          @gObject = null
]
