@ngGmapModule "directives.api.managers", ->
	class @MarkerManager extends oo.BaseObject
		constructor: (gMap,opt_markers,opt_options) ->
			super()
			self = @
			@gMap = gMap
			@gMarkers = []
			@$log = directives.api.utils.Logger
			@$log.info(@)
		add:(gMarker,optDraw)=>
			@handleOptDraw(gMarker,optDraw,true)
			@gMarkers.push(gMarker)
		addMany:(gMarkers)=>
			@add(gMarker) for gMarker in gMarkers

		remove:(gMarker,optDraw)=>
			@handleOptDraw(gMarker,optDraw,false)
			unless optDraw
				return
			index = undefined
			if @gMarkers.indexOf?
				index = @gMarkers.indexOf(gMarker)
			else 
				tempIndex = 0
				_.find(@gMarkers, (marker) ->
					tempIndex += 1
					if marker == gMarker
						index = tempIndex
						return
				)
			if index?
				@gMarkers.splice(index, 1)

		removeMany:(gMarkers)=>
			@remove(marker) for marker in @gMarkers 

		draw:=>
			deletes = []
			for gMarker in @gMarkers
				do(gMarker)=>
					unless gMarker.isDrawn
						if gMarker.doAdd
							gMarker.setMap(@gMap) 
						else 
							deletes.push(gMarker)

			@remove(gMarker,true) for gMarker in deletes


		clear:=>
			gMarker.setMap(null) for gMarker in @gMarkers
			delete @gMarkers
			@gMarkers = []

		handleOptDraw:(gMarker,optDraw,doAdd)=>
			if optDraw == true
				if doAdd then gMarker.setMap(@gMap) else gMarker.setMap(null) 
				gMarker.isDrawn = true
			else 
				gMarker.isDrawn = false
				gMarker.doAdd = doAdd