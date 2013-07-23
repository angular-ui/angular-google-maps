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

		onCordsChanged:(newValue,oldValue,id) =>
			throw new Exception("Not Implemented!!")

		onIconChanged:(newValue,oldValue,id,coords) =>
			throw new Exception("Not Implemented!!")
		onDestroy:(id) =>
			throw new Exception("Not Implemented!!")

		linkInit:(element,mapCtrl,scope,animate)=>
			throw new Exception("Not Implemented!!")

		controller: ($scope, $element) ->
			@getMarker = ->
				$element.data('instance')

		link: (scope, element, attrs, mapCtrl) =>
			# Validate required properties
			if (angular.isUndefined(scope.coords) or 
				scope.coords == undefined or
				angular.isUndefined(scope.coords.latitude) or
				angular.isUndefined(scope.coords.longitude))
					$log.error("marker: no valid coords attribute found")
					return
			# Wrap marker initialization inside a $timeout() call to make sure the map is created already
			@$timeout( =>
				animate = angular.isDefined(attrs.animate) and @isFalse(attrs.animate)

				@linkInit(element,mapCtrl,scope,animate,angular.isDefined(attrs.click))

				scope.$watch('coords', (newValue, oldValue) =>
					@onCordsChanged(newValue,oldValue,scope.$id)
				, true)

				scope.$watch('icon', (newValue, oldValue) =>
					@onIconChanged(newValue,oldValue,scope.$id,scope.coords)
				, true)

				# remove marker on scope $destroy
				scope.$on("$destroy", -> onDestroy(scope.$id))
			)