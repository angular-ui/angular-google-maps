angular.module("google-maps.directives.api.managers")
.factory "MarkerManager", ["Logger", "FitHelper", "PropMap", (Logger, FitHelper, PropMap) ->
  class MarkerManager extends FitHelper
    @include FitHelper
    constructor: (gMap, opt_markers, opt_options) ->
      super()
      @gMap = gMap
      @gMarkers = new PropMap()
      @$log = Logger
      @$log.info(@)

    add: (gMarker, optDraw = true)=>
      unless gMarker.key?
        msg = "gMarker.key undefined and it is REQUIRED!!"
        Logger.error msg
        throw msg
      exists = (@gMarkers.get gMarker.key)?
      if !exists
        @handleOptDraw(gMarker, optDraw, true)
        @gMarkers.put gMarker.key, gMarker

    addMany: (gMarkers)=>
      gMarkers.forEach (gMarker) =>
        @add(gMarker)

    remove: (gMarker, optDraw = true)=>
      @handleOptDraw gMarker, optDraw, false
      if @gMarkers.get gMarker.key
        @gMarkers.remove gMarker.key

    removeMany: (gMarkers)=>
      @gMarkers.values().forEach (marker) =>
        @remove(marker)

    draw: =>
      deletes = []
      @gMarkers.values().forEach (gMarker) =>
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
      @gMarkers.values().forEach (gMarker) ->
        gMarker.setMap null
      delete @gMarkers
      @gMarkers = new PropMap()

    handleOptDraw: (gMarker, optDraw, doAdd)=>
      if optDraw == true
        if doAdd
          gMarker.setMap @gMap
        else
          gMarker.setMap null
        gMarker.isDrawn = true
      else
        gMarker.isDrawn = false
        gMarker.doAdd = doAdd

    fit: ()=>
      super @getGMarkers(), @gMap

    getGMarkers: =>
      @gMarkers.values()

  MarkerManager
]