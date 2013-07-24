@module "directives.api", ->
	@MarkerUtil =
		createMarkerOptions:(map,coords,icon,animate) ->
			opts = angular.extend({}, @DEFAULTS, {
				position: new google.maps.LatLng(coords.latitude, coords.longitude),
				map: map.getMap(),
				icon: icon,
				visible: coords.latitude? and coords.longitude?
			})
			if !animate
				delete opts.animation;
			opts
