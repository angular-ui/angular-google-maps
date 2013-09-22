@ngGmapModule "directives.api.managers", ->
	class @ClustererMarkerManager extends oo.BaseObject
		constructor: (gMap,opt_markers,opt_options) ->
			super()
			self = @
			@opt_options = opt_options
			if opt_options? and opt_markers == undefined
				@clusterer = new MarkerClusterer(gMap,undefined,opt_options)
			else if opt_options? and opt_markers?
				@clusterer = new MarkerClusterer(gMap,opt_markers,opt_options)
			else
				@clusterer = new MarkerClusterer(gMap)
			@clusterer.setIgnoreHidden(true)
			@$log = directives.api.utils.Logger
			@noDrawOnSingleAddRemoves = true
			@$log.info(@)
		add:(gMarker)=>
			@clusterer.addMarker(gMarker,@noDrawOnSingleAddRemoves)
		addMany:(gMarkers)=>
			@clusterer.addMarkers(gMarkers)
		remove:(gMarker)=>
			@clusterer.removeMarker(gMarker,@noDrawOnSingleAddRemoves)
		removeMany:(gMarkers)=>
			@clusterer.addMarkers(gMarkers)
		draw:()=>
			@clusterer.repaint()
		clear:()=>
			@clusterer.clearMarkers()
			@clusterer.repaint()