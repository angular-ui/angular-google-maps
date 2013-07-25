###
	Window directive for GoogleMap Info Windows, where ng-repeat is being used....
	Where Html DOM element is 1:1 on Scope and a Model
###	
@module "directives.api", ->
	class @Window extends directives.api.IWindow

		constructor: ($log, $timeout, $compile, $http, $templateCache) ->
			super($log, $timeout, $compile, $http, $templateCache)
			self = @
			@clsName = "Window"
			@template = '<span class="angular-google-maps-window" ng-transclude></span>'
			@$log.info(self)

		link: (scope, element, attrs, ctrls) =>
			@$timeout( => 
				isIconVisibleOnClick = true
				if angular.isDefined(attrs.isiconvisibleonclick) 
					isIconVisibleOnClick = scope.isIconVisibleOnClick
				mapCtrl = ctrls[0].getMap()
				markerCtrl = if ctrls.length > 1 and ctrls[1]? then ctrls[1].getMarker() else undefined

				opts = @createWindowOptions(markerCtrl,scope,element.html(),@DEFAULTS)

				if mapCtrl? #at the very least we need a Map, the marker is optional as we can create Windows without markers
					new directives.api.models.WindowModel(scope,opts,isIconVisibleOnClick,mapCtrl,markerCtrl,@$templateCache,@$compile)
			,50)