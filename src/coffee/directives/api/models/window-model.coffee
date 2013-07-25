@module "directives.api.models", ->
	class @WindowModel extends oo.BaseObject
		@include directives.api.models.WindowFunctions
		constructor:(scope,opts,isIconVisibleOnClick,mapCtrl, markerCtrl,$log,$http,$templateCache,$compile)->
			@scope = scope
			@opts = opts
			@mapCtrl = mapCtrl
			@markerCtrl = markerCtrl
			@isIconVisibleOnClick = isIconVisibleOnClick
			@initialMarkerVisibility = if @markerCtrl? then @markerCtrl.getVisible() else false
			@$log = $log
			@$http = $http
			@$templateCache = $templateCache
			@$compile = $compile
			@gWin = new google.maps.InfoWindow(opts)
			# Open window on click
			@markerCtrl.setClickable(true) if @markerCtrl?

			@handleClick(@scope,@mapCtrl,@markerCtrl,@gWin,@isIconVisibleOnClick,@initialMarkerVisibility)
			@watchShow(scope,$http,$templateCache,@$compile,@gWin,@showWindow,@hideWindow,@mapCtrl)

			@$log.info(@)


		destroy:()=>
			@hideWindow(@gWin)
			@scope.$destroy()
			delete @gWin
			delete @

