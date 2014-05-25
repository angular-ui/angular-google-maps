angular.module("google-maps.directives.api.managers")
.factory "ClustererMarkerManager", ["Logger", "FitHelper", ($log, FitHelper) ->
    class ClustererMarkerManager extends FitHelper
      constructor: (gMap, opt_markers, opt_options, @opt_events) ->
        super()
        self = @
        @opt_options = opt_options
        if opt_options? and opt_markers == undefined
          @clusterer = new MarkerClusterer(gMap, undefined, opt_options)
        else if opt_options? and opt_markers?
          @clusterer = new MarkerClusterer(gMap, opt_markers, opt_options)
        else
          @clusterer = new MarkerClusterer(gMap)

        @attachEvents @opt_events, "opt_events"

        @clusterer.setIgnoreHidden(true)
        @noDrawOnSingleAddRemoves = true
        $log.info(@)
      add: (gMarker)=>
        @clusterer.addMarker(gMarker, @noDrawOnSingleAddRemoves)
      addMany: (gMarkers)=>
        @clusterer.addMarkers(gMarkers)
      remove: (gMarker)=>
        @clusterer.removeMarker(gMarker, @noDrawOnSingleAddRemoves)
      removeMany: (gMarkers)=>
        @clusterer.addMarkers(gMarkers)
      draw: ()=>
        @clusterer.repaint()
      clear: ()=>
        @clusterer.clearMarkers()
        @clusterer.repaint()

      attachEvents:(options, optionsName) ->
        if angular.isDefined(options) and options? and angular.isObject(options)
          for eventName, eventHandler of options
            if options.hasOwnProperty(eventName) and angular.isFunction(options[eventName])
              $log.info "#{optionsName}: Attaching event: #{eventName} to clusterer"
              google.maps.event.addListener @clusterer, eventName, options[eventName]

      clearEvents:(options) ->
        if angular.isDefined(options) and options? and angular.isObject(options)
          for eventName, eventHandler of options
            if options.hasOwnProperty(eventName) and angular.isFunction(options[eventName])
              $log.info "#{optionsName}: Clearing event: #{eventName} to clusterer"
              google.maps.event.clearListeners @clusterer, eventName

      destroy: =>
        @clearEvents @opt_events
        @clearEvents @opt_internal_events
        @clear()

      fit: ()=>
        super @clusterer.getMarkers() , @clusterer.getMap()

    ClustererMarkerManager
  ]