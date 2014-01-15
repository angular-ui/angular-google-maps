###
	Basic Directive api for a label. Basic in the sense that this directive contains 1:1 on scope and model. 
	Thus there will be one html element per marker within the directive.
###
@ngGmapModule "directives.api", ->
	class @Label extends directives.api.ILabel
		constructor: ($timeout) ->
			super($timeout)
			self = @
			@require = '^marker'
			@template = '<span class="angular-google-maps-marker-label" ng-transclude></span>'
			@$log.info(@)
		link: (scope, element, attrs, ctrl) =>
			@$timeout( =>
				markerCtrl = ctrl.getMarkerScope().gMarker
				if markerCtrl?
					label = new directives.api.models.child.MarkerLabelChildModel(markerCtrl, scope)
				scope.$on("$destroy", => 
					label.destroy()
				)
			,directives.api.utils.GmapUtil.defaultDelay + 25)