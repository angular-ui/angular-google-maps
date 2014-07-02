angular.module("google-maps.directives.api.managers")
.factory "MarkerManager", ["Logger", "FitHelper", (Logger, FitHelper) ->
    class MarkerManager extends FitHelper
      @include FitHelper
      constructor: (gMap, opt_markers, opt_options) ->
        super()
        self = @
        @gMap = gMap
        @gMarkers = []
        @$log = Logger
        @$log.info(@)

      add: (gMarker, optDraw, redraw=true)=>
        @handleOptDraw(gMarker, optDraw, redraw)
        @gMarkers.push(gMarker)

      addMany: (gMarkers)=>
        @add(gMarker) for gMarker in gMarkers

      remove: (gMarker, optDraw)=>
        @handleOptDraw(gMarker, optDraw, false)
        unless optDraw
          return
        index = undefined
        if @gMarkers.indexOf?
          index = @gMarkers.indexOf(gMarker)
        else
          tempIndex = 0
          _.find @gMarkers, (marker) ->
            tempIndex += 1
            if marker == gMarker
              index = tempIndex
              return
        if index?
          @gMarkers.splice(index, 1)

      removeMany: (gMarkers)=>
        @gMarkers.forEach (marker) =>
          @remove(marker)

      draw: =>
        deletes = []
        @gMarkers.forEach (gMarker) =>
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
        gMarker.setMap(null) for gMarker in @gMarkers
        delete @gMarkers
        @gMarkers = []

      handleOptDraw: (gMarker, optDraw, doAdd)=>
        if optDraw == true
          if doAdd then gMarker.setMap(@gMap) else gMarker.setMap(null)
          gMarker.isDrawn = true
        else
          gMarker.isDrawn = false
          gMarker.doAdd = doAdd

      fit: ()=>
        super @gMarkers,@gMap

    MarkerManager
  ]