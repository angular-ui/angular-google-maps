###
	Windows directive where many windows map to the models property
###	
@module "directives.api", ->
	class @Windows extends directives.api.IWindow
		constructor: ($timeout, $compile, $http, $templateCache,$interpolate) ->
			super($timeout, $compile, $http, $templateCache)
			self = @
			@$interpolate = $interpolate
			@clsName = "Windows"
			@require= ['^googleMap', '^?markers']
			@template = '<span class="angular-google-maps-windows" ng-transclude></span>'
			@scope.models = '=models' #if undefined it will try get a markers models
			@$log.info(self)
		
		link: (scope, element, attrs, ctrls) =>
			new directives.api.models.parent.WindowsParentModel(scope, element, attrs, ctrls, @$timeout, 
				@$compile, @$http, @$templateCache,@$interpolate)