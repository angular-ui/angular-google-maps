angular.module("google-maps.directives.api")
.factory "Control", ["IControl", "$http", "$templateCache", (IControl, $http, $templateCache) ->
	class Control extends IControl
		constructor: ($timeout) ->
			super($timeout)
			self = @

		link: (scope, element, attrs, ctrl) ->
			# Validate attributes
			if angular.isUndefined scope.template
				@$log.error 'mapControl: could not find a valid template property'
				return

			position = if angular.isDefined scope.position then scope.position.toUpperCase().replace /-/g, '_' else 'TOP_CENTER'
			if not google.maps.ControlPosition[position]
				@$log.error 'mapControl: invalid position property'
				return

			# Wrap control initialization inside a $timeout() call to make sure the map is created already
			@$timeout =>
				map = ctrl.getMap()
				controlDiv = document.createElement 'div'
				$http.get(scope.template, { cache: $templateCache })
					.success (template) =>
						controlDiv.innerHTML = template
					.error (error) =>
						@$log.error 'mapControl: template could not be found'
					.then =>
						map.controls[google.maps.ControlPosition[position]].push controlDiv
						if angular.isDefined scope.click
							google.maps.event.addDomListener controlDiv, 'click', =>
								scope.$apply scope.click

]