###
	Functions are taking entireley local variables as to try and reuse functionality. 
	Hopefully this will work when an HTML Element is created or not for an InfoWindow.
###
@module "directives.api.models", ->
	@WindowModelFunctions =
		watchShow:(scope,$http,$templateCache,$compile,gWin,showHandle,hideHandle,mapCtrl) ->
			scope.$watch('show()', (newValue, oldValue) ->
				if (newValue != oldValue)
					if (newValue)
						showHandle(scope,$http,$templateCache,$compile,gWin,mapCtrl)
					else
						hideHandle(gWin)
				else 
					if (newValue and !gWin.getMap())
						# If we're initially showing the marker and it's not yet visible, show it.
						showHandle(scope,$http,$templateCache,$compile,gWin,mapCtrl)
			,true)

		handleClick:(scope,mapCtrl,markerInstance,gWin,isIconVisibleOnClick,initialMarkerVisibility) ->
			if markerInstance?
				# Show the window and hide the marker on click
				google.maps.event.addListener(markerInstance, 'click', ->
					gWin.setPosition(markerInstance.getPosition())
					gWin.open(mapCtrl)
					markerInstance.setVisible(isIconVisibleOnClick)
				)
				# Set visibility of marker back to what it was before opening the window
				google.maps.event.addListener(gWin, 'closeclick', ->
					markerInstance.setVisible(initialMarkerVisibility)
					scope.closeClick()
				)
		
		showWindow:(scope,$http,$templateCache,$compile,gWin,mapCtrl) ->
			if scope.templateUrl
				$http.get(scope.templateUrl, { cache: $templateCache }).then((content) ->
					templateScope = scope.$new()
					if angular.isDefined(scope.templateParameter)
						templateScope.parameter = scope.templateParameter
					compiled = $compile(content.data)(templateScope)
					gWin.setContent(compiled.get(0))
					gWin.open(mapCtrl)
				)
			else
				gWin.open(mapCtrl)

		hideWindow: (gWin) ->
			gWin.close()

@module "directives.api.models", ->
	class @WindowModel extends oo.BaseObject
		@include directives.api.models.WindowModelFunctions
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

