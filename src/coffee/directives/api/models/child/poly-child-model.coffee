angular.module("google-maps.directives.api".ns())
.factory "PolyChildModel".ns(), [
  "BaseObject".ns(), "Logger".ns(), "$timeout", "array-sync".ns(), "GmapUtil".ns(), "EventsHelper".ns()
  (BaseObject, $log, $timeout, arraySync, GmapUtil, EventsHelper) ->
    class PolyChildModel extends BaseObject
      constructor: ->

      buildOpts: (pathPoints) =>
        opts = angular.extend {}, @DEFAULTS,
          map: @map
          path: pathPoints
          strokeColor: @scope.stroke?.color
          strokeOpacity: @scope.stroke?.opacity
          strokeWeight: @scope.stroke?.weight
          fillColor: @scope.fill?.color
          fillOpacity: @scope.fill?.opacity

        angular.forEach
          clickable: true
          draggable: false
          editable: false
          geodesic: false
          visible: true
          static: false
          fit: false
          zIndex: 0
        , (defaultValue, key) =>
          if angular.isUndefined(@scope[key]) or @scope[key] is null
            opts[key] = defaultValue
          else
            opts[key] = @scope[key]

        opts.editable = false if opts.static
        opts
]