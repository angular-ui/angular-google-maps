@ngGmapModule "directives.api.models.child", ->
	class @MarkerChildModel extends oo.BaseObject
		@include directives.api.utils.GmapUtil
		constructor:(index,model,parentScope,gMap,$timeout,defaults,doClick)->
			@index = index
			@model = model
			@defaults = defaults
			@parentScope = parentScope
			@iconKey = parentScope.icon
			@coordsKey = parentScope.coords
			@clickKey = parentScope.click()
			@optionsKey = parentScope.options
			@myScope = parentScope.$new(false)
			@myScope.model = model
			@gMap = gMap
			@setMyScope(model,undefined,true)
			@createMarker(model)
			@doClick = doClick
			@$log = directives.api.utils.Logger
			@myScope.$watch('model',(newValue, oldValue) =>
				if (newValue != oldValue)
					@setMyScope(newValue,oldValue) 
			,true)

			@watchDestroy(@myScope)

		setMyScope:(model, oldModel = undefined,isInit = false) =>
			@maybeSetScopeValue('icon',model,oldModel,@iconKey,@evalModelHandle,isInit,@setIcon)
			@maybeSetScopeValue('coords',model,oldModel,@coordsKey,@evalModelHandle,isInit,@setCoords)
			@maybeSetScopeValue('click',model,oldModel,@clickKey,@evalModelHandle,isInit)
			@createMarker(model,oldModel,isInit)		

		createMarker:(model, oldModel = undefined,isInit = false)=>
			@maybeSetScopeValue('options',model,oldModel,@optionsKey,(lModel,lModelKey) =>
				if lModel == undefined
					return undefined
				value = if lModelKey == 'self' then lModel else lModel[lModelKey]
				if value == undefined # we still dont have a value see if this is something up the tree or default it
					value = if lModelKey == undefined then @defaults else @myScope.options
				else
					value
			,isInit,@setOptions)

		evalModelHandle:(model,modelKey) ->
			if model == undefined
				return undefined
			if modelKey == 'self'
				model 
			else 
				model[modelKey]

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
			if(scope.$id != @myScope.$id or @gMarker == undefined)
				return
			if (scope.coords?) 
				@gMarker.setMap(@gMap.getMap())
				@gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude))
				@gMarker.setVisible(scope.coords.latitude? and scope.coords.longitude?)
			else
				# Remove marker
				@gMarker.setMap(null)			

		setIcon:(scope) =>
			if(scope.$id != @myScope.$id or @gMarker == undefined)
				return
			@gMarker.setIcon(scope.icon)
			@gMarker.setMap(null)
			@gMarker.setMap(@gMap.getMap())
			@gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude))
			@gMarker.setVisible(scope.coords.latitude and scope.coords.longitude?)

		setOptions:(scope) =>
			if(scope.$id != @myScope.$id)
				return

			if @gMarker?
				@gMarker.setMap(null)
				delete @gMarker		
			unless scope.coords ? scope.icon? scope.options?
				return
			@opts = @createMarkerOptions(@gMap,scope.coords,scope.icon,scope.options)
			@gMarker = new google.maps.Marker(@opts)
			google.maps.event.addListener(@gMarker, 'click', =>
				if @doClick and @myScope.click?
					@myScope.click()
			)

		watchDestroy:(scope)=>
			scope.$on("$destroy", => 
				if @gMarker? #this is possible due to AsyncProcessor in that we created some Children but no gMarker yet
					@gMarker.setMap(null)
					delete @gMarker
				delete @
			)