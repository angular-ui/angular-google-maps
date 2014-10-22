angular.module("google-maps.directives.api.managers".ns())
.factory "MarkerManager".ns(), ["Logger".ns(), "PropMap".ns(), "IMarker".ns(), "MarkerChildModel".ns(), "GmapUtil".ns(), (Logger, PropMap, IMarker, MarkerChildModel, GmapUtil) ->
  class MarkerManager
    constructor: (@gMap, @parentScope, @DEFAULTS) ->
      @gMarkers = new GeoTree()
      @markersInView = []
      @$log = Logger
      @$log.info(@)
      @geoKey = @parentScope.coords
      @idKey = @parentScope.idKey

    evalModel: (model, modelKey) ->
      if model == undefined or modelKey == undefined
        return undefined
      if modelKey == 'self'
        model
      else #modelKey may use dot-notation
        GmapUtil.getPath(model, modelKey)

    add: (model)=>
      # insert model into GeoTree
      @gMarkers.insert @evalModel(model, @geoKey).latitude, @evalModel(model, @geoKey).longitude, {data: {model: model}}
      # mark gMarkers is dirty (we need to redraw map view)
      @dirty = true

    addMany: (models)=>
      @add(model) for model in models
      undefined

    remove: (model, optDraw)=>
      # TODO: implement remove
      @dirty = true

    removeMany: (models)=>
      @remove(model) for model in models

    redraw: (viewBox, zoom)=>
      @dirty = true
      @draw viewBox, zoom

    draw: (viewBox, zoom)=>
      viewBox = @currentViewBox if not viewBox
      return unless viewBox

      if not @currentViewBox
        @currentViewBox = viewBox
        @dirty = true

      if not @zoom
        @zoom = zoom

      # hide markers which are not in the view anymore
      updateRegions = (new BBDiff()).getUpdateRegions @currentViewBox, viewBox, @dirty, @zoom - zoom
      for region in updateRegions.remove
        markers = @gMarkers.find region.ne, region.sw
        for marker in markers
          data = marker.data
          if data
            @show data.gMarker, false
            marker.visible = false

      # show markers which are new in view
      for region in updateRegions.add
        markers = @gMarkers.find region.ne, region.sw
        for marker in markers
          if not marker.data.gMarker
            childScope = @parentScope.$new(false)
            childScope.events = @parentScope.events
            keys = {}
            scope = @parentScope
            _.each IMarker.keys, (v,k) ->
              keys[k] = scope[k]
            data = new MarkerChildModel(childScope, marker.data.model, keys, @map, @DEFAULTS,
                    @gMarkerManager, doDrawSelf = false) #this is managed so child is not drawing itself
            #data = new MarkerChildModel(marker.data.model, @parentScope, @map, @DEFAULTS, @doClick, @idKey)
            marker.data = data
          if not marker.visible
            @show marker.data.gMarker, true
            marker.visible = true

      # store current view box and zoom. clear dirty flag
      @currentViewBox = viewBox
      @zoom = zoom
      @dirty = false

    clear: =>
      @gMarkers.forEach (marker) ->
        marker.data.gMarker.setMap null if marker.data.gMarker
      delete @gMarkers
      @gMarkers = new GeoTree()

    show: (gMarker, show)=>
      if show
        if not gMarker.getMap()
          gMarker.setMap(@gMap)
        if not gMarker.getVisible()
          gMarker.setVisible true
      else
        gMarker.setVisible(false) if gMarker
      undefined

    getGMarkers: =>
      @gMarkers.find()

  MarkerManager
]