angular.module("google-maps.directives.api.models.parent".ns())
.factory "DrawingManagerParentModel".ns(),
    ['Logger'.ns(), '$timeout'
      ($log, $timeout) ->
        class DrawingManagerParentModel
          constructor: (@scope, element, @attrs, @map) ->
            drawingManager = new google.maps.drawing.DrawingManager @scope.options
            drawingManager.setMap @map
            
            if @scope.control?
              @scope.control.getDrawingManager = () =>
                drawingManager

            if !@scope.static and @scope.options
              @scope.$watch("options", (newValue) =>
                drawingManager?.setOptions(newValue)
              , true)
                
            # Remove drawingManager on scope $destroy
            scope.$on "$destroy", =>
              drawingManager.setMap null
              drawingManager = null
    ]
