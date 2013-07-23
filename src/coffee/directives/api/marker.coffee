@module "directives.api", ->
	class @Marker extends directives.api.IMarker
		constructor: ($log, $timeout) ->
			super($log,$timeout)
			self = @
			$log.info(@)
			@marker = {}
			@mapCtrl = undefined

		onCordsChanged:(newValue,oldValue,id) =>
			if (newValue != oldValue) 
				if (newValue) 
					@marker[id].setMap(@mapCtrl.getMap())
					@marker[id].setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude))
					@marker[id].setVisible(newValue.latitude? and newValue.longitude?)
				else
					# Remove marker
					@marker[id].setMap(undefined);	
					
		onIconChanged:(newValue,oldValue,id,coords) =>
			if (newValue != oldValue) 
				@marker[id].icon = newValue
				@marker[id].setMap(undefined)
				@marker[id].setMap(@mapCtrl.getMap())
				@marker[id].setPosition(new google.maps.LatLng(coords.latitude, coords.longitude))
				@marker[id].setVisible(coords.latitude and coords.longitude?);

		onDestroy:(id)=>
			@marker[id].setMap(null)	

		linkInit:(element,mapCtrl,scope,animate,doClick) =>
			@mapCtrl = mapCtrl
			opts = angular.extend({}, @DEFAULTS, {
				position: new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude),
				map: mapCtrl.getMap(),
				icon: scope.icon,
				visible: scope.coords.latitude? and scope.coords.longitude?
			})

			if !animate
				delete opts.animation;

			@marker[scope.$id] = new google.maps.Marker(opts)
			element.data('instance', @marker[scope.$id])

			google.maps.event.addListener(@marker[scope.$id], 'click', ->
				if doClick and scope.click?
					scope.click()
			)