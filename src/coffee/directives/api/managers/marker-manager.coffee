angular.module("uiGmapgoogle-maps.directives.api.managers")
.factory "uiGmapMarkerManager", ["uiGmapLogger", "uiGmapFitHelper",
"uiGmapPropMap", (Logger, FitHelper, PropMap) ->
  class MarkerManager
    @type = 'MarkerManager'
    constructor: (gMap, opt_markers, opt_options) ->
      @type = MarkerManager.type
      @gMap = gMap
      @gMarkers = new PropMap()
      @$log = Logger
      @$log.info(@)

    add: (gMarker, optDraw = true) =>
      unless gMarker.key?
        msg = "gMarker.key undefined and it is REQUIRED!!"
        Logger.error msg
        throw msg
      exists = @gMarkers.get gMarker.key
      if !exists
        @handleOptDraw(gMarker, optDraw, true)
        @gMarkers.put gMarker.key, gMarker

    #if you want flashing as in remove and then re-add use this
    #otherwise leave the marker in the map and just edit its properties (coords, icon etc)
    update: (gMarker, optDraw = true) =>
      @remove gMarker, optDraw
      @add gMarker, optDraw

    addMany: (gMarkers) =>
      gMarkers.forEach (gMarker) =>
        @add(gMarker)

    remove: (gMarker, optDraw = true) =>
      @handleOptDraw gMarker, optDraw, false
      if @gMarkers.get gMarker.key
        @gMarkers.remove gMarker.key

    removeMany: (gMarkers)=>
      gMarkers.forEach (marker) =>
        @remove(marker)

    draw: =>
      deletes = []
      @gMarkers.each (gMarker) =>
        unless gMarker.isDrawn
          if gMarker.doAdd
            gMarker.setMap(@gMap)
            gMarker.isDrawn = true
          else
            deletes.push(gMarker)

      deletes.forEach (gMarker) =>
        gMarker.isDrawn = false
        @remove(gMarker, true)

    clear: =>
      @gMarkers.each (gMarker) ->
        gMarker.setMap null
      delete @gMarkers
      @gMarkers = new PropMap()

    handleOptDraw: (gMarker, optDraw, doAdd) =>
      if optDraw == true
        if doAdd
          gMarker.setMap @gMap
        else
          gMarker.setMap null
        gMarker.isDrawn = true
      else
        gMarker.isDrawn = false
        gMarker.doAdd = doAdd

    fit: =>
      FitHelper.fit @getGMarkers(), @gMap

    getGMarkers: =>
      @gMarkers.values()

  MarkerManager
]
