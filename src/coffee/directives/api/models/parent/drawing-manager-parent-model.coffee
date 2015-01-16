angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapDrawingManagerParentModel',
    ['uiGmapLogger', '$timeout', 'uiGmapBaseObject', 'uiGmapEventsHelper',
      ($log, $timeout, BaseObject, EventsHelper) ->
        class DrawingManagerParentModel extends BaseObject
          @include EventsHelper
          constructor: (@scope, element, @attrs, @map) ->
            gObject = new google.maps.drawing.DrawingManager @scope.options
            gObject.setMap @map

            listeners = undefined

            if @scope.control?
              @scope.control.getDrawingManager = ->
                gObject

            if !@scope.static and @scope.options
              @scope.$watch 'options', (newValue) ->
                gObject?.setOptions newValue
              , true

            if @scope.events?
              listeners = @setEvents gObject, @scope, @scope
              scope.$watch 'events', (newValue, oldValue) =>
                unless _.isEqual newValue, oldValue
                  @removeEvents listeners if listeners?
                  listeners = @setEvents gObject, @scope, @scope

            scope.$on '$destroy', =>
              @removeEvents listeners if listeners?
              gObject.setMap null
              gObject = null
    ]
