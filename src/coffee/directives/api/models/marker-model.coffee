@module "directives.api.models", ->
	class @MarkerModel extends oo.BaseObject
		@include directives.api.utils.GmapUtil
		constructor:(index,model,parentScope,$timeout,$log,notifyLocalDestroy)->
			@index = index
			@iconKey = scope.icon
			@coordsKey = scope.coords
			@opts = createMarkerOptions(@mapCtrl,model[@coordsKey],model[@iconKey])
			@gMarker = new google.maps.Marker(opts)
			google.maps.event.addListener(@gMarker, 'click', ->
				#this needs to be thought about as scope is not 1:1 on clicking..... hmmmmm :/
				if doClick and scope.click?
					scope.click()
			)
			@myScope = parentScope.$new(false)
			@myScope.icon = model[@iconKey]
			@myScope.coords = model[@coordsKey]

			@$timeout( =>
				@watchCoords(@myScope)
				@watchIcon(@myScope)
				@watchDestroy(@myScope)
			)
		destroy:() =>
			@myScope.$destroy()

		watchCoords:(scope) =>
			scope.$watch('coords', (newValue, oldValue) =>
				if (newValue != oldValue) 
					if (newValue) 
						@gmap.setMap(@mapCtrl.getMap())
						@gmap.setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude))
						@gmap.setVisible(newValue.latitude? and newValue.longitude?)
					else
						# Remove marker
						@gmap.setMap(undefined)			
			, true)
					
		watchIcon:(scope) =>
			scope.$watch('icon', (newValue, oldValue) =>
				if (newValue != oldValue) 
					@gmap.icon = newValue	
					@gmap.setMap(undefined)
					@gmap.setMap(@mapCtrl.getMap())
					@gmap.setPosition(new google.maps.LatLng(coords.latitude, coords.longitude))
					@gmap.setVisible(coords.latitude and coords.longitude?)
			, true)

		watchDestroy:(scope)=>
			scope.$on("$destroy", => 
				@gmap.setMap(null)
				notifyLocalDestroy(@index) if notifyLocalDestroy?
			)