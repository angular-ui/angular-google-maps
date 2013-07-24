# simple module of functions to be overriden / mixed in
@module "directives.api", ->
	class @IMarker extends oo.BaseObject
		# Animation is enabled by default
		DEFAULTS: { animation: google.maps.Animation.DROP }
		  
		# Check if a value is literally false
		# @param value the value to test
			# @returns {boolean} true if value is literally false, false otherwise	 
		isFalse: (value) ->
			['false', 'FALSE', 0, 'n', 'N', 'no', 'NO'].indexOf(value) != -1   

		constructor: ($log, $timeout) ->
			self = @
			@clsName = "IMarker"
			@$log = $log
			@$timeout = $timeout
			@restrict = 'ECMA'
			@require = '^googleMap'
			@priority = -1
			@transclude = true
			@template = '<span class="angular-google-map-marker" ng-transclude></span>'
			@replace = true
			@scope = {
				coords: '=coords',
				icon: '=icon',
				click: '&click'
			}

			$log.info(self)

		watchCoords:(scope) =>
			throw new Exception("Not Implemented!!")

		watchIcon:(scope) =>
			throw new Exception("Not Implemented!!")
		watchDestroy:(scope) =>
			throw new Exception("Not Implemented!!")

		linkInit:(element,mapCtrl,scope,animate)=>
			throw new Exception("Not Implemented!!")

		controller: ($scope, $element) ->
			@getMarker = ->
				$element.data('instance')

		validateLinkedScope:(scope)=>
			ret = angular.isUndefined(scope.coords) or 
				scope.coords == undefined or
				angular.isUndefined(scope.coords.latitude) or
				angular.isUndefined(scope.coords.longitude)
			if(ret)
				$log.error(@clsName + ": no valid coords attribute found")
			ret
		link: (scope, element, attrs, mapCtrl) =>
			# Validate required properties
			if (@validateLinkedScope(scope))
					return
			# Wrap marker initialization inside a $timeout() call to make sure the map is created already
			@$timeout( =>
				animate = angular.isDefined(attrs.animate) and @isFalse(attrs.animate)
				@linkInit(element,mapCtrl,scope,animate,angular.isDefined(attrs.click))
				@watchCoords(scope)
				@watchIcon(scope)
				@watchDestroy(scope)
			)