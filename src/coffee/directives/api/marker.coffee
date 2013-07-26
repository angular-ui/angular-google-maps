###
	Basic Directive api for a marker. Basic in the sense that this directive contains 1:1 on scope and model. 
	Thus there will be one html element per marker within the directive.
###
@module "directives.api", ->
	class @Marker extends directives.api.IMarker
		@include directives.api.utils.GmapUtil

		constructor: ($timeout) ->
			super($timeout)
			self = @
			@template = '<span class="angular-google-map-marker" ng-transclude></span>'
			@clsName = "Marker"
			@$log.info(@)
			@markers = {}
			@mapCtrl = undefined


		controller:($scope, $element) ->
			@getMarker = ->
				$element.data('instance')

		validateLinkedScope:(scope)=>
			super(scope) or angular.isUndefined(scope.coords.latitude) or angular.isUndefined(scope.coords.longitude)

		# if we have made it here all attributes are valid so we can initialize and glue things together
		linkInit:(element,mapCtrl,scope,animate,doClick) =>
			#linked scope is 1:1 per marker
			@mapCtrl = mapCtrl
			opts = @createMarkerOptions(mapCtrl,scope.coords,scope.icon,animate,@DEFAULTS)

			#using scope.$id as the identifier for a marker as scope.$id should be unique, no need for an index (as it is the index)
			gMarker = new google.maps.Marker(opts)
			@markers[scope.$id] = gMarker
			element.data('instance', gMarker)

			google.maps.event.addListener(gMarker, 'click', ->
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
						@markers[scope.$id].setMap(null)			
			, true)
					
		watchIcon:(scope) =>
			scope.$watch('icon', (newValue, oldValue) =>
				if (newValue != oldValue) 
					@markers[scope.$id].icon = newValue	
					@markers[scope.$id].setMap(null)
					@markers[scope.$id].setMap(@mapCtrl.getMap())
					@markers[scope.$id].setPosition(new google.maps.LatLng(coords.latitude, coords.longitude))
					@markers[scope.$id].setVisible(coords.latitude and coords.longitude?)
			, true)

		watchDestroy:(scope)=>
			scope.$on("$destroy", => 
				#remove from gMaps and then free resources
				@markers[scope.$id].setMap(null)
				delete @markers[scope.$id]
			)
