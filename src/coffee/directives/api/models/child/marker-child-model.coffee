@ngGmapModule "directives.api.models.child", ->
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

			@myScope.model = model
			@setMyScope(model,undefined,true)
			@defaults = defaults
			@gMap = gMap
			@opts = @createMarkerOptions(@gMap,@myScope.coords,@myScope.icon,@myScope.animate,@defaults)
			@gMarker = new google.maps.Marker(@opts)
			@doClick = doClick
			@$log = directives.api.utils.Logger
			google.maps.event.addListener(@gMarker, 'click', =>

				if @doClick and @myScope.click?
					$timeout(=>
						@myScope.click()
					)
			)
			@myScope.$watch('model',(newValue, oldValue) =>
				if (newValue != oldValue)
					@setMyScope(newValue,oldValue) 
			,true)

			@watchDestroy(@myScope)

		setMyScope:(model, oldModel = undefined,isInit = false) =>
			@maybeSetScopeValue('icon',model,oldModel,@iconKey,@evalModelHandle,isInit,@setIcon)
			@maybeSetScopeValue('coords',model,oldModel,@coordsKey,@evalModelHandle,isInit,@setCoords)
			@maybeSetScopeValue('click',model,oldModel,@clickKey,@evalModelHandle,isInit)
			@maybeSetScopeValue('animate',model,oldModel,@animateKey,(lModel,lModelKey) =>
				value = if lModelKey == 'self' then lModel else lModel[lModelKey]
				value = if lModelKey == undefined then false else @myScope.animate
			,isInit)			

		evalModelHandle:(model,modelKey) ->
			if modelKey == 'self' then model else model[modelKey]

		maybeSetScopeValue:(scopePropName,model,oldModel,modelKey,evaluate,isInit,gSetter = undefined) ->
			if oldModel == undefined
				@myScope[scopePropName] = evaluate(model,modelKey)
				unless isInit
					gSetter(@myScope) if gSetter?
				return

			oldVal = evaluate(oldModel,modelKey)
			newValue = evaluate(model,modelKey)
			if(newValue != oldVal and @myScope[scopePropName] != newValue)
				@myScope[scopePropName] = newValue
				unless isInit
					gSetter(@myScope) if gSetter?

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

		watchDestroy:(scope)=>
			scope.$on("$destroy", => 
				@gMarker.setMap(null)
				notifyLocalDestroy(@index) if notifyLocalDestroy?
			)