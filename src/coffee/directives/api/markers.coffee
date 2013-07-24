# ###
# Markers will map icon and coords differently as there us not 1:1 Scope to marker
# icon - will be the iconKey to the marker value ie: to get the icon marker[iconKey]
# coords - will be the coordsKey to the marker value ie: to get the icon marker[coordsKey]

# property changes from IMarker reflect that the look up key for a value has changed and not the actual icon or coords itself

# Coords and icons need to be rewatched within Markers linked scope
# ###
# @module "directives.api", ->
# 	class @Markers extends directives.api.IMarker
# 		constructor: ($log, $timeout) ->
# 			super($log,$timeout)
# 			self = @
# 			@clsName = "Markers"
# 			@scope.markers = '=markers'
# 			@markers = {}
# 			@markersIndex = 0
# 			@mapCtrl = undefined
# 			@$timeout = $timeout
# 			@$log = $log
# 			$log.info(@)

# 		validateLinkedScope:(scope)->
# 			markerNotDefined = angular.isUndefined(scope.markers) or scope.markers == undefined
# 			if(markerNotDefined)
# 				$log.error(@clsName + ": no valid markers attribute found")

# 			super.validateLinkedScope(scope) or markerNotDefined

# 		# if we have made it here all attributes are valid so we can initialize and glue things together	
# 		linkInit:(element,mapCtrl,scope,animate,doClick) =>
# 			@mapCtrl = mapCtrl
# 			@createMarkers(element,scope,animate,doClick)

# 		createMarkers:(element,scope,animate,doClick) =>
# 			for model in scope.markers
# 				do(model) =>
# 					@markers[@markersIndex] = 
# 						new directives.api.models.MarkerModel(index,model,scope,@$timeout,@$log, (index) =>
# 							delete @markers[index]
# 						)

# 					@markersIndex++
# 					element.data('instance', @markers)

# 		watchCoords:(scope) =>
# 			scope.$watch('coords', (newValue, oldValue) =>
# 				if (newValue != oldValue) 
# 					model.coordsKey = newValue for model in @markers
# 			, true)
					
# 		watchIcon:(scope) =>
# 			scope.$watch('icon', (newValue, oldValue) =>
# 				if (newValue != oldValue) 
# 					model.iconKey = newValue for model in @markers
# 			, true)

# 		watchDestroy:(scope)=>
# 			#need to figure out how to handle individual destroys
# 			#slap index to the external model so that when they pass external back
# 			#for destroy we have a lookup? 
# 			#this will require another attribute for destroySingle(marker)
# 			scope.$on("$destroy", => 
# 				model.destroy() for model in @markers
# 			)


# @module "directives.api.models", ->
# 	class @MarkerModel extends oo.BasicObject
# 		@include directives.api.MarkerUtil
# 		constructor:(index,model,parentScope,$timeout,$log,notifyLocalDestroy)->
# 			@index = index
# 			@iconKey = scope.icon
# 			@coordsKey = scope.coords
# 			@opts = createMarkerOptions(@mapCtrl,model[@coordsKey],model[@iconKey])
# 			@gMarker = new google.maps.Marker(opts)
# 			google.maps.event.addListener(@gMarker, 'click', ->
# 				#this needs to be thought about as scope is not 1:1 on clicking..... hmmmmm :/
# 				if doClick and scope.click?
# 					scope.click()
# 			)
# 			@myScope = parentScope.$new(false)
# 			@myScope.icon = model[@iconKey]
# 			@myScope.coords = model[@coordsKey]

# 			@$timeout( =>
# 				@watchCoords(@myScope)
# 				@watchIcon(@myScope)
# 				@watchDestroy(@myScope)
# 			)
# 		destroy:() =>
# 			@myScope.$destroy()

# 		watchCoords:(scope) =>
# 			scope.$watch('coords', (newValue, oldValue) =>
# 				if (newValue != oldValue) 
# 					if (newValue) 
# 						@gmap.setMap(@mapCtrl.getMap())
# 						@gmap.setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude))
# 						@gmap.setVisible(newValue.latitude? and newValue.longitude?)
# 					else
# 						# Remove marker
# 						@gmap.setMap(undefined)			
# 			, true)
					
# 		watchIcon:(scope) =>
# 			scope.$watch('icon', (newValue, oldValue) =>
# 				if (newValue != oldValue) 
# 					@gmap.icon = newValue	
# 					@gmap.setMap(undefined)
# 					@gmap.setMap(@mapCtrl.getMap())
# 					@gmap.setPosition(new google.maps.LatLng(coords.latitude, coords.longitude))
# 					@gmap.setVisible(coords.latitude and coords.longitude?)
# 			, true)

# 		watchDestroy:(scope)=>
# 			scope.$on("$destroy", => 
# 				@gmap.setMap(null)
# 				notifyLocalDestroy(@index) if notifyLocalDestroy?
# 			)