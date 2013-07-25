###
	Functions are using entireley local variables as to try and reuse functionality. 
	Hopefully this will work when an HTML Element is created or not for an InfoWindow.

	IE if another window-model needs to be derrived for Windows or other Window directives.
###
@module "directives.api.models", ->
	@WindowFunctions =
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