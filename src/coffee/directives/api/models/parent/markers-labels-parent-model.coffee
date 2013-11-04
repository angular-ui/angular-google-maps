@ngGmapModule "directives.api.models.parent", ->
	class @MarkersLabelsParentModel extends oo.BaseObject
		constructor: (@scope, @element, @attrs, @ctrls, @$timeout, @$compile, @$http, @$templateCache, @$interpolate) ->
			self = @

			@labels = []
			@bigGulp = directives.api.utils.AsyncProcessor
			@markersScope = @ctrls[0].getMarkersScope()

			@$log = directives.api.utils.Logger
			@$log.info(self)
			
			@$timeout( =>
				@createChildMarkerLabels()
				@watchForRebuild(@markersScope)
			,50)

		createChildMarkerLabels: =>
			@bigGulp.handleLargeArray(@markersScope.markerModels, (marker) =>
				childScope = @scope.$new(false)

				###
				markers-labels directive will specify a content attribute which will used 
				as the label content. This attribute is expected to exist in the marker model

				TODO: this is dirty, need a better way to handle this
				###
				content_key = childScope.labelContent
				if marker.model[content_key]
					childScope.labelContent = marker.model[content_key]

					# creates the label model
					label = new directives.api.models.child.MarkerLabelChildModel(marker.gMarker, childScope)
					@labels.push(label)
					@scope.$on("$destroy", =>
						label.destroy()
					)
				else
					@$log.info("marker content not specified: " + content_key)

			,(()->),() => #handle done callBack
				@scope.labelModels = @labels
			)

		watchForRebuild:(scope) =>
			scope.$on('markersRebuild', (event, data) =>
				@$log.info('### REBUILD')
				@labels = []
				@createChildMarkerLabels()
			)