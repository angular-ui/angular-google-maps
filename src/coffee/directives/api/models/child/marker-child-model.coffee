@module "directives.api.models.child", ->
	class @MarkerChildModel extends oo.BaseObject
		@include directives.api.utils.GmapUtil
		constructor:(index,model,parentScope,gMap,$timeout,notifyLocalDestroy,defaults,doClick)->
			@index = index
			@model = model
			@parentScope = parentScope
			@iconKey = parentScope.icon
			@coordsKey = parentScope.coords
			@clickKey = parentScope.click()
			@animateKey = parentScope.animate
			@myScope = parentScope.$new(false)
			@setMyScope(model)
			@myScope.$watch('model',(newValue, oldValue) =>
				if (newValue != oldValue)
					@setMyScope(newValue) 
			,true)
			@defaults = defaults
			@gMap = gMap
			@opts = @createMarkerOptions(@gMap,@myScope.coords,@myScope.icon,@myScope.animate,@defaults)
			@gMarker = new google.maps.Marker(@opts)
			@doClick = doClick
			@$log = directives.api.utils.Logger
			google.maps.event.addListener(@gMarker, 'click', =>
				#this needs to be thought about as scope is not 1:1 on clicking..... hmmmmm :/
				if @doClick and @myScope.click?
					@myScope.click()
			)
			@setCoords(@myScope)
			@setIcon(@myScope)
			$timeout( =>
				@watchCoords(@myScope)
				@watchIcon(@myScope)
				@watchDestroy(@myScope)
			)
		setMyScope:(model)=>
			@myScope.icon = if @iconKey == 'self' then model else model[@iconKey]
			@myScope.coords = if @coordsKey == 'self' then model else model[@coordsKey]
			@myScope.click = if @clickKey == 'self' then model else model[@clickKey]
			@myScope.animate = if @animateKey == 'self' then model else model[@animateKey]
			@myScope.animate = if @animateKey == undefined then false else @myScope.animate
			@myScope.model = model

		destroy:() =>
			@myScope.$destroy()

		setCoords:(scope) =>
			if(scope.$id != @myScope.$id)
				return
			if (scope.coords?) 
				@gMarker.setMap(@gMap.getMap())
				@gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude))
				@gMarker.setVisible(scope.coords.latitude? and scope.coords.longitude?)
			else
				# Remove marker
				@gMarker.setMap(null)			

		setIcon:(scope) =>
			if(scope.$id != @myScope.$id)
				return
			@gMarker.icon = scope.icon	
			@gMarker.setMap(null)
			@gMarker.setMap(@gMap.getMap())
			@gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude))
			@gMarker.setVisible(scope.coords.latitude and scope.coords.longitude?)
			

		watchCoords:(scope) =>
			scope.$watch('coords', (newValue, oldValue) =>
				if (newValue != oldValue)
					@parentScope.doRebuild = false
					@setCoords(newValue)
					@parentScope.doRebuild = true
			, true)
					
		watchIcon:(scope) =>
			scope.$watch('icon', (newValue, oldValue) =>
				if (newValue != oldValue) 
					@parentScope.doRebuild = false
					@setIcon(newValue)
					@parentScope.doRebuild = true
			, true)

		watchDestroy:(scope)=>
			scope.$on("$destroy", => 
				@gMarker.setMap(null)
				notifyLocalDestroy(@index) if notifyLocalDestroy?
			)