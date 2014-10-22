angular.module("google-maps.directives.api.managers".ns())
.factory "ClustererMarkerManager".ns(), ["Logger".ns(), "PropMap".ns(), "MarkerChildModel".ns(), ($log, PropMap, MarkerChildModel) ->
  class ClustererMarkerManager
    constructor: (gMap, opt_markers, opt_options, @opt_events, @parentScope, @DEFAULTS) ->
      self = @
      @opt_options = opt_options
      if opt_options? and opt_markers == undefined
        @clusterer = new MarkerClusterer(gMap, undefined, opt_options, MarkerChildModel, @parentScope, @DEFAULTS, @doClick, @idKey)
      else if opt_options? and opt_markers?
        @clusterer = new MarkerClusterer(gMap, opt_markers, opt_options, MarkerChildModel, @parentScope, @DEFAULTS, @doClick, @idKey)
      else
        @clusterer = new MarkerClusterer(gMap, null, null, MarkerChildModel, @parentScope, @DEFAULTS, @doClick, @idKey)
      @propMapGMarkers = new PropMap() #keep in sync with cluster.markers_

      @attachEvents @opt_events, "opt_events"

      @clusterer.setIgnoreHidden(true)
      @noDrawOnSingleAddRemoves = true
      $log.info(@)
      @gMarkers = new GeoTree()
      #@currentViewBox
      @dirty = true

    add: (model)=>
      @gMarkers.insert model.geo.latitude, model.geo.longitude, {data: {model: model}}
      @dirty = true

    addMany: (models)=>
      @add(model) for model in models
        #@clusterer.addModels(gMarkers)

    remove: (model)=>
      #@clusterer.removeMarker(gMarker, @noDrawOnSingleAddRemoves)

    removeMany: (models)=>
      @remove(model) for model in models
      #@clusterer.removeModels(gMarkers)

    draw: (viewBox, zoom) =>
      viewBox = @currentViewBox if not viewBox
      return unless viewBox

      if not @currentViewBox
        @currentViewBox = viewBox
        @dirty = true

      if not @zoom
        @zoom = zoom

      _self = @
      # show markers which are new in view
      @gMarkers.find viewBox.ne, viewBox.sw, (marker) ->
        marker.visible = {} if not marker.visible
        if not (marker.visible && marker.visible[zoom])
          _self.clusterer.addMarker marker, true
          marker.visible[zoom] = true
        false

      @currentViewBox = viewBox
      @zoom = zoom

      @clusterer.repaint @dirty
      @dirty = false

    redraw: (viewBox, zoom) =>
      @dirty = true
      @draw viewBox, zoom

    clear: (dontRepaint)=>
      @clusterer.clearMarkers()
      @clusterer.repaint() if not dontRepaint
      @gMarkers.forEach (marker) ->
        marker.data.gMarker.setMap null if marker.data.gMarker
      delete @gMarkers
      @gMarkers = new GeoTree()

    attachEvents: (options, optionsName) ->
      if angular.isDefined(options) and options? and angular.isObject(options)
        for eventName, eventHandler of options
          if options.hasOwnProperty(eventName) and angular.isFunction(options[eventName])
            $log.info "#{optionsName}: Attaching event: #{eventName} to clusterer"
            google.maps.event.addListener @clusterer, eventName, options[eventName]

    clearEvents: (options) ->
      if angular.isDefined(options) and options? and angular.isObject(options)
        for eventName, eventHandler of options
          if options.hasOwnProperty(eventName) and angular.isFunction(options[eventName])
            $log.info "#{optionsName}: Clearing event: #{eventName} to clusterer"
            google.maps.event.clearListeners @clusterer, eventName

    destroy: =>
      @clearEvents @opt_events
      @clearEvents @opt_internal_events
      @clear()

    getGMarkers: =>
      @clusterer.getMarkers().values()

    checkSync: =>
      throw "GMarkers out of Sync in MarkerClusterer" if @getGMarkers().length != @propMapGMarkers.length

  ClustererMarkerManager
]