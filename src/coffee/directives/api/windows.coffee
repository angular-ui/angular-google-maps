###
	Windows directive where many windows map to the models property
###	
@module "directives.api", ->
	class @Windows extends directives.api.IWindow

		constructor: ($log, $timeout, $compile, $http, $templateCache) ->
			super($log, $timeout, $compile, $http, $templateCache)
			self = @
			@clsName = "Windows"
			@template = '<span class="angular-google-maps-windows" ng-transclude></span>'
			@scope.models = '&models' #property can be fetched from parentScope, usually a marker scope
			@windows = {}
			@scopePropNames = ['show','coords','templateUrl','templateParameter',
			'isIconVisibleOnClick','closeClick']
			#setting up local references to propety keys IE: @coordsKey
			@[name + 'Key'] = undefined for name in @scopePropNames
			@$log.info(self)
		#keep track of the property key name for what show() is defined for
		watchShow:(scope) =>
			scope.$watch('show()', (newValue, oldValue) =>
				if (newValue != oldValue)
					@showKey = newValue
					#update all windows.show() bindings
			,true)

		link: (scope, element, attrs, ctrls) =>
			modelsNotDefined = angular.isUndefined(scope.models) or scope.models == undefined
			if(modelsNotDefined)
				@$log.error(@clsName + ": no valid models attribute found")
				return
			###
			being that we cannot tell the difference in Key String vs. a normal value string (TemplateUrl)
			we will assume that all scope values are string expressions either pointing to a key (propName) or using 
			'self' to point the model as container.	

			This may force redundant information into the model, but this appears to be the most flexible approach.		
			###
			@[name + 'Key'] = scope[name] for name in @scopePropNames
			@$timeout( => 

				isIconVisibleOnClick = true
				if angular.isDefined(attrs.isiconvisibleonclick) 
					isIconVisibleOnClick = scope.isIconVisibleOnClick
				mapCtrl = ctrls[0].getMap()
				markerCtrl = if ctrls.length > 1 and ctrls[1]? then ctrls[1].getMarker() else undefined

				if mapCtrl? #at the very least we need a Map, the marker is optional as we can create Windows without markers
					for model in scope.models
						do(model) =>
							opts = @createWindowOptions(markerCtrl,scope,element.html(),@DEFAULTS)
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
							childScope = scope.$new(false)
							for name in @scopePropNames
								do (name) =>
									nameKey = name + 'Key'
									childScope[name] = if @[nameKey] == 'self' then model else model[@[nameKey]] 
							@windows[@windowIndex] = 
								new directives.api.models.WindowModel(
									childScope,opts,isIconVisibleOnClick,mapCtrl,
									markerCtrl,@$log,@$http,@$templateCache,@$compile
								)
			,50)