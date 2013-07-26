@module "directives.api.models", ->
	class @MarkerModel extends oo.BaseObject
		@include directives.api.utils.GmapUtil
		constructor:(index,model,parentScope,gMap,$timeout,notifyLocalDestroy,defaults,doClick)->
			@index = index
			@model = model
			@iconKey = parentScope.icon
			@coordsKey = parentScope.coords
			@myScope = parentScope.$new(false)
			@myScope.icon = if @iconKey == 'self' then model else model[@iconKey]
			@myScope.coords = if @coordsKey == 'self' then model else model[@coordsKey]
			@gMap = gMap
			@opts = @createMarkerOptions(@gMap,@myScope.coords,@myScope.icon,defaults)
			@gMarker = new google.maps.Marker(@opts)
			@doClick = doClick
			@$log = directives.api.utils.Logger
			google.maps.event.addListener(@gMarker, 'click', =>
				#this needs to be thought about as scope is not 1:1 on clicking..... hmmmmm :/
				if @doClick and @myScope.click?
					@myScope.click()
			)
			$timeout( =>
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
						@gMarker.setMap(@gMap.getMap())
						@gMarker.setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude))
						@gMarker.setVisible(newValue.latitude? and newValue.longitude?)
					else
						# Remove marker
						@gMarker.setMap(null)			
			, true)
					
		watchIcon:(scope) =>
			scope.$watch('icon', (newValue, oldValue) =>
				if (newValue != oldValue) 
					@gMarker.icon = newValue	
					@gMarker.setMap(null)
					@gMarker.setMap(@gMap.getMap())
					@gMarker.setPosition(new google.maps.LatLng(coords.latitude, coords.longitude))
					@gMarker.setVisible(coords.latitude and coords.longitude?)
			, true)

		watchDestroy:(scope)=>
			scope.$on("$destroy", => 
				@gMarker.setMap(null)
				notifyLocalDestroy(@index) if notifyLocalDestroy?
			)