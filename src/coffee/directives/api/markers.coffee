###
Markers will map icon and coords differently as there us not 1:1 Scope to marker
icon - will be the iconKey to the marker value ie: to get the icon marker[iconKey]
coords - will be the coordsKey to the marker value ie: to get the icon marker[coordsKey]

property changes from IMarker reflect that the look up key for a value has changed and not the actual icon or coords itself

Coords and icons need to be rewatched within Markers linked scope
###
@module "directives.api", ->
	class @Markers extends directives.api.IMarker
		constructor: ($log, $timeout) ->
			super($log,$timeout)
			self = @
			@clsName = "Markers"
			@scope.markers = '=markers'
			@markers = []
			@mapCtrl = undefined
			@iconKey = undefined
			@coordsKey = undefined
			$log.info(@)

		validateLinkedScope:(scope)->
			markerNotDefined = angular.isUndefined(scope.markers) or scope.markers == undefined
			if(markerNotDefined)
				$log.error(@clsName + ": no valid markers attribute found")

			super.validateLinkedScope(scope) or markerNotDefined

		# if we have made it here all attributes are valid so we can initialize and glue things together	
		linkInit:(element,mapCtrl,scope,animate,doClick) =>
			@mapCtrl = mapCtrl
			opts = angular.extend({}, @DEFAULTS, {
				position: new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude),
				map: mapCtrl.getMap(),
				icon: scope.icon,
				visible: scope.coords.latitude? and scope.coords.longitude?
			})

			if !animate
				delete opts.animation;

			@marker[scope.$id] = new google.maps.Marker(opts)
			element.data('instance', @marker[scope.$id])

			google.maps.event.addListener(@marker[scope.$id], 'click', ->
				if doClick and scope.click?
					scope.click()
			)

		watchCoords:(scope) =>
			scope.$watch('coords', (newValue, oldValue) =>
				if (newValue != oldValue) 
					if (newValue) 
						@markers[scope.$id].setMap(@mapCtrl.getMap())
						@markers[scope.$id].setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude))
						@markers[scope.$id].setVisible(newValue.latitude? and newValue.longitude?)
					else
						# Remove marker
						@markers[scope.$id].setMap(undefined)			
			, true)
					
		watchIcon:(scope) =>
			scope.$watch('icon', (newValue, oldValue) =>
				if (newValue != oldValue) 
					@markers[scope.$id].icon = newValue	
					@markers[scope.$id].setMap(undefined)
					@markers[scope.$id].setMap(@mapCtrl.getMap())
					@markers[scope.$id].setPosition(new google.maps.LatLng(coords.latitude, coords.longitude))
					@markers[scope.$id].setVisible(coords.latitude and coords.longitude?)
			, true)

		watchDestroy:(scope)=>
			scope.$on("$destroy", => @markers[scope.$id].setMap(null))
