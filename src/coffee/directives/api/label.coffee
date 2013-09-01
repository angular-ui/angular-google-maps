###
	Basic Directive api for a label. Basic in the sense that this directive contains 1:1 on scope and model. 
	Thus there will be one html element per marker within the directive.
###
@ngGmapModule "directives.api", ->
	class @Label extends directives.api.ILabel
		constructor: ($timeout) ->
			super($timeout)
			self = @
			@$log.info(@)
		link: (scope, element, attrs, ctrls) =>
			@$timeout( =>
				mapCtrl = ctrls[0].getMap()
				markerCtrl = if ctrls.length > 1 and ctrls[1]? then ctrls[1].getMarker() else undefined
				if mapCtrl? #at the very least we need a Map, the marker is optional as we can create Windows without markers
					label = new directives.api.models.child.MarkerLabelChildModel(markerCtrl, scope)
				scope.$on("$destroy", => 
					label.destroy()
				)
			,50)