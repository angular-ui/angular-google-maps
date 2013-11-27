###
Markers will map icon and coords differently than directibes.api.Marker. This is because Scope and the model marker are
not 1:1 in this setting.
	
	- icon - will be the iconKey to the marker value ie: to get the icon marker[iconKey]
	- coords - will be the coordsKey to the marker value ie: to get the icon marker[coordsKey]

    - watches from IMarker reflect that the look up key for a value has changed and not the actual icon or coords itself
    - actual changes to a model are tracked inside directives.api.model.MarkerModel

###
@ngGmapModule "directives.api", ->
    class @Markers extends directives.api.IMarker
        constructor: ($timeout) ->
            super($timeout)
            self = @
            @template = '<span class="angular-google-map-markers" ng-transclude></span>'

            @scope.models = '=models'
            @scope.doCluster = '=docluster'
            @scope.clusterOptions = '=clusteroptions'
            @scope.fit = '=fit'
            @scope.labelContent = '=labelcontent'
            @scope.labelAnchor = '@labelanchor'
            @scope.labelClass = '@labelclass'

            @$timeout = $timeout
            @$log.info(@)

        controller: ['$scope', '$element', ($scope, $element) ->
            getMarkersScope: ->
                $scope
        ]

        link: (scope, element, attrs, ctrl) =>
            new directives.api.models.parent.MarkersParentModel(scope, element, attrs, ctrl, @$timeout)