###
	Windows directive where many windows map to the models property
###	
@module "directives.api", ->
	class @Windows extends directives.api.IWindow

		constructor: ($log, $timeout, $compile, $http, $templateCache,$interpolate) ->
			super($log, $timeout, $compile, $http, $templateCache)
			self = @
			@$interpolate = $interpolate
			@clsName = "Windows"
			@require= ['^googleMap', '^?markers']
			@template = '<span class="angular-google-maps-windows" ng-transclude></span>'
			@scope.models = '=models' #if undefined it will try get a markers models
			@windows = []
			@windwsIndex = 0
			@scopePropNames = ['show','coords','templateUrl','templateParameter',
			'isIconVisibleOnClick','closeClick']
			#setting up local references to propety keys IE: @coordsKey
			@[name + 'Key'] = undefined for name in @scopePropNames
			@linked = undefined
			@models = undefined
			@contentKeys = undefined #model keys to parse html angular content
			@isIconVisibleOnClick = undefined
			@firstTime = true
			@$log.info(self)
		
		#watch this scope(Parent to all WindowModels), these updates reflect expression / Key changes
		#thus they need to be pushed to all the children models so that they are bound to the correct objects / keys
		watch:(scope,name,nameKey) =>
			scope.$watch(name, (newValue, oldValue) =>
				if (newValue != oldValue)
					@[nameKey] = if typeof newValue == 'function' then newValue() else newValue
					for model in @windows
						do(model) =>
				 			model.scope[name] = if (@[nameKey] == 'self' or @[nameKey] == undefined) then model else model[@[nameKey]]  
			,true)

		watchModels:(scope) =>
			scope.$watch('models', (newValue, oldValue) =>
				if (newValue != oldValue) 
					for model in @windows
						do(model) =>
							model.destroy()
					# delete @windows
					@windows = []
					@windowsIndex = 0
					@createChildScopesWindows()
			, true)

		watchDestroy:(scope)=>
			scope.$on("$destroy", => 
				model.destroy() for model in @windows
				delete @windows
				@windows = []
				@windowsIndex = 0
			)

		watchOurScope:(scope) =>
			for name in @scopePropNames
				do(name) =>
					nameKey = name + 'Key'
					@[nameKey] = if typeof scope[name] == 'function' then scope[name]() else scope[name]
					@watch(scope,name,nameKey)

		link: (scope, element, attrs, ctrls) =>
			@linked = new directives.api.utils.Linked(scope,element,attrs,ctrls)	
			
			@$timeout( => 
				@watchOurScope(scope)
				@createChildScopesWindows()
			,50)

		createChildScopesWindows: =>
			###
			being that we cannot tell the difference in Key String vs. a normal value string (TemplateUrl)
			we will assume that all scope values are string expressions either pointing to a key (propName) or using 
			'self' to point the model as container/object of interest.	

			This may force redundant information into the model, but this appears to be the most flexible approach.		
			###
			@isIconVisibleOnClick = true
			if angular.isDefined(@linked.attrs.isiconvisibleonclick) 
				isIconVisibleOnClick = @linked.scope.isIconVisibleOnClick
			gMap = @linked.ctrls[0].getMap()
			markersScope = if @linked.ctrls.length > 1 and @linked.ctrls[1]? then @linked.ctrls[1].getMarkersScope() else undefined

			modelsNotDefined = angular.isUndefined(@linked.scope.models) or scope.models == undefined
			
			if(modelsNotDefined and (markersScope == undefined or markersScope.markerModels == undefined or markersScope.models == undefined ))
				@$log.info("No models to create windows from! Need direct models or models derrived from markers!")
				return
			if gMap? 
				#at the very least we need a Map, the marker is optional as we can create Windows without markers
				if @linked.scope.models?
					#we are creating windows with no markers
					@models = @linked.scope.models
					if(@firstTime)
						@watchModels(@linked.scope)
						@watchDestroy(@linked.scope)
					@setContentKeys(@linked.scope.models) #only setting content keys once per model array
					@createWindow(model,undefined,gMap) for model in @linked.scope.models
				else
					#creating windows with parent markers
					@models = markersScope.models
					if(@firstTime)
						@watchModels(markersScope)
						@watchDestroy(markersScope)
					@setContentKeys(markersScope.models) #only setting content keys once per model array
					for mm in markersScope.markerModels
						do(mm) =>
							@createWindow(mm.model,mm.gMarker,gMap)
			@firstTime = false

		setContentKeys:(models)=>
			if(models.length > 0)
				@contentKeys = Object.keys(models[0])
						
		createWindow: (model,gMarker,gMap)=>
			###
			Create ChildScope to Mimmick an ng-repeat created scope, must define the below scope
		  		scope= {
					coords: '=coords',
					show: '&show',
					templateUrl: '=templateurl',
					templateParameter: '=templateparameter',
					isIconVisibleOnClick: '=isiconvisibleonclick',
					closeClick: '&closeclick'
				}
			###
			childScope = @linked.scope.$new(false)
			for name in @scopePropNames
				do (name) =>
					nameKey = name + 'Key'
					childScope[name] = if (@[nameKey] == 'self' or @[nameKey] == undefined) then model else model[@[nameKey]]
			parsedContent = @interpolateContent(@linked.element.html(),model)
			opts = @createWindowOptions(gMarker,childScope,parsedContent,@DEFAULTS)
			@windows.push( 
				new directives.api.models.WindowModel( childScope,opts,@isIconVisibleOnClick,gMap,gMarker,@$log,@$http,@$templateCache,@$compile)
			)

		interpolateContent: (content,model) =>
			exp = @$interpolate(content)
			interpModel = {}
			interpModel[key] = model[key] for key in @contentKeys
			exp(interpModel)