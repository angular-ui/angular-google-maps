@module "directives.api.models", ->
	class @MarkerModel extends oo.BaseObject
		@include directives.api.utils.GmapUtil
		constructor:(index,model,parentScope,mapCtrl,$timeout,$log,notifyLocalDestroy)->
			@index = index
			@iconKey = parentScope.icon
			@coordsKey = parentScope.coords
			@myScope = parentScope.$new(false)
			@myScope.icon = if @iconKey == 'self' then model else model[@iconKey]
			@myScope.coords = if @coordsKey == 'self' then model else model[@coordsKey]
			@mapCtrl = mapCtrl
			@opts = @createMarkerOptions(@mapCtrl,@myScope.coords,@myScope.icon)
			@gMarker = new google.maps.Marker(@opts)
			google.maps.event.addListener(@gMarker, 'click', ->
				#this needs to be thought about as scope is not 1:1 on clicking..... hmmmmm :/
				if doClick and @myScope.click?
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