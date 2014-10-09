angular.module("google-maps.directives.api".ns())
.factory "PolygonChildModel".ns(), [
  "PolygonOptionsBuilder".ns(), "Logger".ns(), "$timeout",
  "array-sync".ns(), "GmapUtil".ns(), "EventsHelper".ns()
  (Builder, $log, $timeout,
  arraySync, GmapUtil, EventsHelper) ->
    class PolygonChildModel extends Builder
      @include GmapUtil
      @include EventsHelper
      constructor: (@scope, @attrs, @map, @defaults, @model) ->
        @listeners = undefined
        # Validate required properties
        if angular.isUndefined(scope.path) or scope.path is null or not @validatePath(scope.path)
          $log.error "polygon: no valid path attribute found"
          return

        pathPoints = @convertPathPoints(scope.path)
        polygon = new google.maps.Polygon(@buildOpts(pathPoints))
        @extendMapBounds @map, pathPoints  if scope.fit

        #TODO refactor all these sets and watches to be handled functionally as an array
        if !scope.static and angular.isDefined(scope.editable)
          scope.$watch "editable", (newValue, oldValue) ->
            polygon.setEditable newValue if newValue != oldValue

        if angular.isDefined(scope.draggable)
          scope.$watch "draggable", (newValue, oldValue) ->
            polygon.setDraggable newValue if newValue != oldValue

        if angular.isDefined(scope.visible)
          scope.$watch "visible", (newValue, oldValue) ->
            polygon.setVisible newValue if newValue != oldValue

        if angular.isDefined(scope.geodesic)
          scope.$watch "geodesic", (newValue, oldValue) =>
            polygon.setOptions @buildOpts(polygon.getPath()) if newValue != oldValue

        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.opacity)
          scope.$watch "stroke.opacity", (newValue, oldValue) =>
            polygon.setOptions @buildOpts(polygon.getPath())

        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.weight)
          scope.$watch "stroke.weight", (newValue, oldValue) =>
            polygon.setOptions @buildOpts(polygon.getPath()) if newValue != oldValue

        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.color)
          scope.$watch "stroke.color", (newValue, oldValue) =>
            polygon.setOptions @buildOpts(polygon.getPath()) if newValue != oldValue

        if angular.isDefined(scope.fill) and angular.isDefined(scope.fill.color)
          scope.$watch "fill.color", (newValue, oldValue) =>
            polygon.setOptions @buildOpts(polygon.getPath()) if newValue != oldValue

        if angular.isDefined(scope.fill) and angular.isDefined(scope.fill.opacity)
          scope.$watch "fill.opacity", (newValue, oldValue) =>
            polygon.setOptions @buildOpts(polygon.getPath()) if newValue != oldValue

        if angular.isDefined(scope.zIndex)
          scope.$watch "zIndex", (newValue, oldValue) =>
            polygon.setOptions @buildOpts(polygon.getPath()) if newValue != oldValue

        if angular.isDefined(scope.events) and scope.events isnt null and angular.isObject(scope.events)
          @listeners = EventsHelper.setEvents polygon, scope, scope

        arraySyncer = arraySync polygon.getPath(), scope, "path", (pathPoints) =>
          @extendMapBounds @map, pathPoints  if scope.fit

        # Remove polygon on scope $destroy
        scope.$on "$destroy", =>
          polygon.setMap null
          @removeEvents @listeners
          if arraySyncer
            arraySyncer()
            arraySyncer = null
]
