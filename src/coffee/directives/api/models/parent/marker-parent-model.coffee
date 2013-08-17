###
	Basic Directive api for a marker. Basic in the sense that this directive contains 1:1 on scope and model. 
	Thus there will be one html element per marker within the directive.
###
@ngGmapModule "directives.api.models.parent", ->
	class @MarkerParentModel extends directives.api.models.parent.IMarkerParentModel
		@include directives.api.utils.GmapUtil	
		constructor: (scope, element, attrs, mapCtrl,$timeout) ->
			super(scope, element, attrs, mapCtrl,$timeout)
			self = @
			opts = @createMarkerOptions(mapCtrl,scope.coords,scope.icon,scope.options)
			#using scope.$id as the identifier for a marker as scope.$id should be unique, no need for an index (as it is the index)
			@gMarker = new google.maps.Marker(opts)
			element.data('instance', @gMarker)
			@scope = scope
			google.maps.event.addListener(@gMarker, 'click', =>
				if @doClick and scope.click?
					$timeout( =>
						@scope.click()
					)
			)
			@$log.info(@)
		
		validateScope:(scope)=>
			super(scope) or angular.isUndefined(scope.coords.latitude) or angular.isUndefined(scope.coords.longitude)

		onWatch:(propNameToWatch,scope) =>
			
			switch propNameToWatch
				when 'coords'
					if (scope.coords? and @gMarker?)
						@gMarker.setMap(@mapCtrl.getMap())
						@gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude))
						@gMarker.setVisible(scope.coords.latitude? and scope.coords.longitude?)
						@gMarker.setOptions(scope.options)
					else
						# Remove marker
						@gMarker.setMap(null)			
				when 'icon' 
					if (scope.icon? and scope.coords? and @gMarker?) 
						@gMarker.setOptions(scope.options) 
						@gMarker.setIcon(scope.icon)
						@gMarker.setMap(null)
						@gMarker.setMap(@mapCtrl.getMap())
						@gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude))
						@gMarker.setVisible(scope.coords.latitude and scope.coords.longitude?)
				when 'options'
					if scope.coords? and scope.icon? and scope.options
						@gMarker.setMap(null)
						delete @gMarker			
						@gMarker = new google.maps.Marker(@createMarkerOptions(@mapCtrl,scope.coords,scope.icon,scope.options))
				else 			
					

		onDestroy:(scope)=>
			if @gMarker == undefined
				delete @
				return
			#remove from gMaps and then free resources
			@gMarker.setMap(null)
			delete @gMarker
			delete @

