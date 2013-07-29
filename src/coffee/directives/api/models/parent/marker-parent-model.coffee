###
	Basic Directive api for a marker. Basic in the sense that this directive contains 1:1 on scope and model. 
	Thus there will be one html element per marker within the directive.
###
@module "directives.api.models.parent", ->
	class @MarkerParentModel extends directives.api.models.parent.IMarkerParentModel
		@include directives.api.utils.GmapUtil	
		constructor: (scope, element, attrs, mapCtrl,$timeout) ->
			super(scope, element, attrs, mapCtrl,$timeout)
			self = @
			@clsName = "MarkerParentModel"
			opts = @createMarkerOptions(mapCtrl,scope.coords,scope.icon,@animate,@DEFAULTS)
			#using scope.$id as the identifier for a marker as scope.$id should be unique, no need for an index (as it is the index)
			@gMarker = new google.maps.Marker(opts)
			element.data('instance', @gMarker)
			@scope = scope
			google.maps.event.addListener(@gMarker, 'click', =>
				if @doClick and scope.click?
					@scope.click()
			)
			@$log.info(@)
		
		validateScope:(scope)=>
			super(scope) or angular.isUndefined(scope.coords.latitude) or angular.isUndefined(scope.coords.longitude)

		watchCoords:(scope) =>
			scope.$watch('coords', (newValue, oldValue) =>
				if (newValue != oldValue) 
					if (newValue and @gMarker?) 
						@gMarker.setMap(@mapCtrl.getMap())
						@gMarker.setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude))
						@gMarker.setVisible(newValue.latitude? and newValue.longitude?)
					else
						# Remove marker
						@gMarker.setMap(null)			
			, true)
					
		watchIcon:(scope) =>
			scope.$watch('icon', (newValue, oldValue) =>
				if (newValue != oldValue and @gMarker?) 
					@gMarker.icon = newValue	
					@gMarker.setMap(null)
					@gMarker.setMap(@mapCtrl.getMap())
					@gMarker.setPosition(new google.maps.LatLng(coords.latitude, coords.longitude))
					@gMarker.setVisible(coords.latitude and coords.longitude?)
			, true)

		watchDestroy:(scope)=>
			scope.$on("$destroy", => 
				if @gMarker == undefined
					delete @
					return
				#remove from gMaps and then free resources
				@gMarker.setMap(null)
				delete @gMarker
				delete @
			)
