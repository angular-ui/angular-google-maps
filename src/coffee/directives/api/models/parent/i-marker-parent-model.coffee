###
	- interface for all markers to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- coords
 			- icon
		- implementation needed on watches
###	
@module "directives.api.models.parent", ->
	class @IMarkerParentModel extends oo.BaseObject
		# Animation is enabled by default
		DEFAULTS: { animation: google.maps.Animation.DROP }
		  
		# Check if a value is literally false
		# @param value the value to test
			# @returns {boolean} true if value is literally false, false otherwise	 
		isFalse: (value) ->
			['false', 'FALSE', 0, 'n', 'N', 'no', 'NO'].indexOf(value) != -1   

		constructor: (scope, element, attrs, mapCtrl,$timeout) ->
			self = @
			# Validate required properties
			if (@validateScope(scope))
					return
			@animate = angular.isDefined(attrs.animate) and @isFalse(attrs.animate)
			@doClick = angular.isDefined(attrs.click)
			@mapCtrl = mapCtrl
			@clsName = "IMarker"
			@$log = directives.api.utils.Logger
			@$timeout = $timeout
			# Wrap marker initialization inside a $timeout() call to make sure the map is created already
			@$timeout( =>
				@watchCoords(scope)
				@watchIcon(scope)
				@watchDestroy(scope)
				@onTimeOut(scope)
			)

		onTimeOut:(scope)=>

		validateScope:(scope)=>
			ret = angular.isUndefined(scope.coords) or 
				scope.coords == undefined 
			if(ret)
				@$log.error(@clsName + ": no valid coords attribute found")
			ret

		watchCoords:(scope) =>
			throw new Exception("Not Implemented!!")

		watchIcon:(scope) =>
			throw new Exception("Not Implemented!!")
		watchDestroy:(scope) =>
			throw new Exception("Not Implemented!!")

		linkInit:(element,mapCtrl,scope,animate)=>
			throw new Exception("Not Implemented!!")