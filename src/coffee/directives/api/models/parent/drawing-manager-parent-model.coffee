angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapDrawingManagerParentModel',
    ['uiGmapLogger', '$timeout', 'uiGmapBaseObject', 'uiGmapEventsHelper'
      ($log, $timeout, BaseObject, EventsHelper) ->
        class DrawingManagerParentModel extends BaseObject
          @include EventsHelper
          constructor: (@scope, element, @attrs, @map) ->
            drawingManager = new google.maps.drawing.DrawingManager @scope.options
            drawingManager.setMap @map

            if @scope.control?
              @scope.control.getDrawingManager = ->
                drawingManager

            if !@scope.static and @scope.options
              @scope.$watch 'options', (newValue) ->
                drawingManager?.setOptions newValue
              , true

            listeners = @setEvents drawingManager, scope, scope

            scope.$on '$destroy', =>
              @removeEvents listeners
              drawingManager.setMap null
              drawingManager = null
    ]
