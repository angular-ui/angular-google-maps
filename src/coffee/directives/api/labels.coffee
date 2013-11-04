@ngGmapModule "directives.api", ->
	class @Labels extends directives.api.ILabel
		constructor: ($timeout) ->
			super($timeout)
			self = @
			@require= ['^markers']
			@template = '<span class="angular-google-map-markers-labels" ng-transclude></span>'
			@scope.models = '=models' # defined at the element?
			@$log.info(@)
		link: (scope, element, attrs, ctrl) =>
			new directives.api.models.parent.MarkersLabelsParentModel(scope, element, attrs, ctrl, @$timeout)