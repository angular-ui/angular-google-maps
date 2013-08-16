###
	Window directive for GoogleMap Info Windows, where ng-repeat is being used....
	Where Html DOM element is 1:1 on Scope and a Model
###	
@ngGmapModule "directives.api", ->
	class @Window extends directives.api.IWindow
		@include directives.api.utils.GmapUtil
		constructor: ($timeout, $compile, $http, $templateCache) ->
			super($timeout, $compile, $http, $templateCache)
			self = @
			@require= ['^googleMap', '^?marker']
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
					window = new directives.api.models.child.WindowChildModel(
						scope,opts,isIconVisibleOnClick,mapCtrl,
						markerCtrl,@$http,@$templateCache,@$compile
					)
				scope.$on("$destroy", => 
					window.destroy()
				)
			,50)