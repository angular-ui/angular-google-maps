angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapDrawingManagerParentModel',
    ['uiGmapLogger', '$timeout', 'uiGmapBaseObject', 'uiGmapEventsHelper',
      ($log, $timeout, BaseObject, EventsHelper) ->
        class DrawingManagerParentModel extends BaseObject
          @include EventsHelper
          constructor: (@scope, element, @attrs, @map) ->
            drawingManager = new google.maps.drawing.DrawingManager @scope.options
            drawingManager.setMap @map

            listeners = undefined

            if @scope.control?
              @scope.control.getDrawingManager = ->
                drawingManager

            if !@scope.static and @scope.options
              @scope.$watch 'options', (newValue) ->
                drawingManager?.setOptions newValue
              , true

            if @scope.events?
              listeners = @setEvents drawingManager, @scope, @scope
              scope.$watch 'events', (newValue, oldValue) =>
                unless _.isEqual newValue, oldValue
                  @removeEvents listeners if listeners?
                  listeners = @setEvents drawingManager, @scope, @scope

            scope.$on '$destroy', =>
              @removeEvents listeners if listeners?
              drawingManager.setMap null
              drawingManager = null
    ]
