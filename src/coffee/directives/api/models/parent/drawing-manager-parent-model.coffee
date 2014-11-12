angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapDrawingManagerParentModel',
    ['uiGmapLogger', '$timeout'
      ($log, $timeout) ->
        class DrawingManagerParentModel
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

            scope.$on '$destroy', ->
              drawingManager.setMap null
              drawingManager = null
    ]
