# simple module of functions to be overriden / mixed in
@module "directives.api", ->
	class @IMarker extends oo.BaseObject
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

		controller: ($scope, $element) ->
			@.getMarker = ->
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
				opts = angular.extend({}, @DEFAULTS, {
					position: new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude),
					map: mapCtrl.getMap(),
					icon: scope.icon,
					visible: scope.coords.latitude? and scope.coords.longitude?
				})

				# Disable animations
				if (angular.isDefined(attrs.animate) and @isFalse(attrs.animate))
					delete opts.animation;

				marker = new google.maps.Marker(opts)
				element.data('instance', marker)

				google.maps.event.addListener(marker, 'click', ->
					if (angular.isDefined(attrs.click) and scope.click?)
						scope.click()
				)

				scope.$watch('coords', (newValue, oldValue) =>
					if (newValue != oldValue) 
						if (newValue) 
							marker.setMap(mapCtrl.getMap())
							marker.setPosition(new google.maps.LatLng(newValue.latitude, newValue.longitude))
							marker.setVisible(newValue.latitude? and newValue.longitude?)
						else
							# Remove marker
							marker.setMap(undefined);
				, true)

				scope.$watch('icon', (newValue, oldValue) =>
					if (newValue != oldValue) 
						marker.icon = newValue
						marker.setMap(undefined)
						marker.setMap(mapCtrl.getMap())
						marker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude))
						marker.setVisible(scope.coords.latitude and scope.coords.longitude?);
				, true)

				# remove marker on scope $destroy
				scope.$on("$destroy", -> marker.setMap(null))
			)
		# Animation is enabled by default
		DEFAULTS: { animation: google.maps.Animation.DROP }
		  
		# Check if a value is literally false
		# @param value the value to test
			# @returns {boolean} true if value is literally false, false otherwise	 
		isFalse: (value) ->
			['false', 'FALSE', 0, 'n', 'N', 'no', 'NO'].indexOf(value) != -1   