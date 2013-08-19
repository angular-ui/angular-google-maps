@ngGmapModule "directives.api.utils", ->
	@GmapUtil =
		createMarkerOptions:(coords,icon,defaults,map = undefined) ->
			opts = angular.extend({}, defaults, {
				position: new google.maps.LatLng(coords.latitude, coords.longitude),
				icon: icon,
				visible: coords.latitude? and coords.longitude?
			})
			opts.map = map: map.getMap() if map?
			opts

		createWindowOptions:(gMarker,scope,content,defaults) ->
			angular.extend({}, defaults, {
				content: content,
				position: 
					if angular.isObject(gMarker)
						gMarker.getPosition() 
					else 
						new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude)
			})	
