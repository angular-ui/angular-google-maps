angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapPolylineChildModel', [
  'uiGmapPolylineOptionsBuilder', 'uiGmapLogger', '$timeout',
  'uiGmaparray-sync', 'uiGmapGmapUtil', 'uiGmapEventsHelper'
  (Builder, $log, $timeout,
  arraySync, GmapUtil,EventsHelper) ->
    class PolylineChildModel extends Builder
      @include GmapUtil
      @include EventsHelper
      constructor: (@scope, @attrs, @map, @defaults, @model) ->

        createPolyline = =>
          pathPoints = @convertPathPoints @scope.path
          if @polyline?
            @clean()
          @polyline = new google.maps.Polyline @buildOpts pathPoints if pathPoints.length > 0
          if @polyline
            @extendMapBounds map, pathPoints if @scope.fit
            arraySync @polyline.getPath(), @scope, 'path', (pathPoints) =>
              @extendMapBounds map, pathPoints if @scope.fit
            @listeners = if @model then @setEvents @polyline, @scope, @model else @setEvents @polyline, @scope, @scope

        createPolyline() #handle stuff without being dependent on digests (ie using watches for init)

        scope.$watch 'path', (newValue, oldValue) =>
          if not _.isEqual(newValue, oldValue) or not @polyline
            createPolyline()
        #TODO refactor all these sets and watches to be handled functionally as an array
        if !scope.static and angular.isDefined(scope.editable)
          scope.$watch 'editable', (newValue, oldValue) =>
            @polyline?.setEditable newValue if newValue isnt oldValue

        if angular.isDefined scope.draggable
          scope.$watch 'draggable', (newValue, oldValue) =>
            @polyline?.setDraggable newValue if newValue isnt oldValue

        if angular.isDefined scope.visible
          scope.$watch 'visible', (newValue, oldValue) =>
            @polyline?.setVisible newValue if newValue isnt oldValue

        if angular.isDefined scope.geodesic
          scope.$watch 'geodesic', (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue isnt oldValue

        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.weight)
          scope.$watch 'stroke.weight', (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue isnt oldValue

        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.color)
          scope.$watch 'stroke.color', (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue isnt oldValue

        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.opacity)
          scope.$watch 'stroke.opacity', (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue isnt oldValue

        if angular.isDefined(scope.icons)
          scope.$watch 'icons', (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue isnt oldValue

        # Remove @polyline on scope $destroy
        scope.$on '$destroy', =>
          @clean()
          @scope = null

        $log.info @

      clean: =>
        @removeEvents @listeners
        @polyline?.setMap null
        @polyline = null
        if arraySyncer
          arraySyncer()
          arraySyncer = null

      destroy: () ->
        @scope.$destroy()
]
