angular.module("google-maps.directives.api")
.factory "PolylineChildModel", ["BaseObject", "Logger", "$timeout", "array-sync", "GmapUtil", "EventsHelper"
  (BaseObject, $log, $timeout, arraySync, GmapUtil,EventsHelper) ->
    class PolylineChildModel extends BaseObject
      @include GmapUtil
      @include EventsHelper
      constructor: (@scope, @attrs, @map, @defaults, @model) ->
        scope.$watch 'path', (newValue, oldValue) =>
          if not _.isEqual(newValue, oldValue) or not @polyline
            pathPoints = @convertPathPoints scope.path
            @polyline = new google.maps.Polyline @buildOpts pathPoints if pathPoints.length > 0
            if @polyline
              @extendMapBounds map, pathPoints if scope.fit
              arraySync @polyline.getPath(), scope, "path", (pathPoints) =>
                @extendMapBounds map, pathPoints if scope.fit
              @listeners = if @model then @setEvents @polyline, scope, @model else @setEvents @polyline, scope, scope


        if !scope.static and angular.isDefined(scope.editable)
          scope.$watch "editable", (newValue, oldValue) =>
            @polyline?.setEditable newValue if newValue != oldValue

        if angular.isDefined scope.draggable
          scope.$watch "draggable", (newValue, oldValue) =>
            @polyline?.setDraggable newValue if newValue != oldValue

        if angular.isDefined scope.visible
          scope.$watch "visible", (newValue, oldValue) =>
            @polyline?.setVisible newValue if newValue != oldValue

        if angular.isDefined scope.geodesic
          scope.$watch "geodesic", (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue != oldValue

        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.weight)
          scope.$watch "stroke.weight", (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue != oldValue

        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.color)
          scope.$watch "stroke.color", (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue != oldValue

        if angular.isDefined(scope.stroke) and angular.isDefined(scope.stroke.opacity)
          scope.$watch "stroke.opacity", (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue != oldValue

        if angular.isDefined(scope.icons)
          scope.$watch "icons", (newValue, oldValue) =>
            @polyline?.setOptions @buildOpts(@polyline.getPath()) if newValue != oldValue

        # Remove @polyline on scope $destroy
        scope.$on "$destroy", =>
          @clean()
          @scope = null

        $log.info @

      buildOpts: (pathPoints) =>
        opts = angular.extend({}, @defaults,
          map: @map
          path: pathPoints
          icons: @scope.icons
          strokeColor: @scope.stroke and @scope.stroke.color
          strokeOpacity: @scope.stroke and @scope.stroke.opacity
          strokeWeight: @scope.stroke and @scope.stroke.weight
        )
        angular.forEach
          clickable: true
          draggable: false
          editable: false
          geodesic: false
          visible: true
          static: false
          fit: false
        , (defaultValue, key) =>
          if angular.isUndefined(@scope[key]) or @scope[key] is null
            opts[key] = defaultValue
          else
            opts[key] = @scope[key]
        opts.editable = false if opts.static
        opts

      clean: =>
        @removeEvents @listeners
        @polyline.setMap null
        @polyline = null
        if arraySyncer
          arraySyncer()
          arraySyncer = null

      destroy: () ->
        @scope.$destroy()
]
