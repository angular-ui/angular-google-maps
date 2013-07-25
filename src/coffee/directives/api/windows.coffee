###
	Windows directive where many windows map to the models property
###	
@module "directives.api", ->
	class @Windows extends directives.api.IWindow

		constructor: ($log, $timeout, $compile, $http, $templateCache) ->
			super($log, $timeout, $compile, $http, $templateCache)
			self = @
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
			@isIconVisibleOnClick = undefined
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

		watchOurScope:(scope) =>
			for name in @scopePropNames
				do(name) =>
					nameKey = name + 'Key'
					@[nameKey] = if typeof scope[name] == 'function' then scope[name]() else scope[name]
					@watch(scope,name,nameKey)
					
		link: (scope, element, attrs, ctrls) =>
			@linked = new directives.api.utils.Linked(scope,element,attrs,ctrls)	
			@watchOurScope(scope)
			@$timeout( => 
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
			markerModels = if @linked.ctrls.length > 1 and @linked.ctrls[1]? then @linked.ctrls[1].getMarkers() else undefined

			modelsNotDefined = angular.isUndefined(@linked.scope.models) or scope.models == undefined
			
			if(modelsNotDefined and markerModels == undefined)
				@$log.info("No models to create windows from! Need direct models or models derrived from markers!")
				return
			if gMap? 
				#at the very least we need a Map, the marker is optional as we can create Windows without markers
				if @linked.scope.models?
					#we are creating windows with no markers
					@models = @linked.scope.models
					@createWindow(model,undefined,gMap) for model in @linked.scope.models
				else
					#creating windows with parent markers
					@models = []
					for mm in markerModels
						do(mm) =>
							@models.push(mm.model)
							@createWindow(mm.model,mm.gMarker,gMap) 
						
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
			opts = @createWindowOptions(gMarker,childScope,@linked.element.html(),@DEFAULTS)
			@windows.push( 
				new directives.api.models.WindowModel( childScope,opts,@isIconVisibleOnClick,gMap,gMarker,@$log,@$http,@$templateCache,@$compile)
			)