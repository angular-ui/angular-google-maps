###
	Basic Directive api for a marker. Basic in the sense that this directive contains 1:1 on scope and model. 
	Thus there will be one html element per marker within the directive.
###
@ngGmapModule "directives.api", ->
	class @Marker extends directives.api.IMarker
		constructor: ($timeout) ->
			super($timeout)
			self = @
			@template = '<span class="angular-google-map-marker" ng-transclude></span>'
			@clsName = "Marker"
			@$log.info(@)
		
		controller:($scope, $element) ->
			@getMarker = ->
				$element.data('instance')

		link: (scope, element, attrs, ctrl) =>
			new directives.api.models.parent.MarkerParentModel(scope, element, attrs, ctrl, @$timeout)