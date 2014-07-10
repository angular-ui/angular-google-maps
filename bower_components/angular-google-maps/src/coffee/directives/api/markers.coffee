angular.module("google-maps.directives.api")
.factory "Markers", ["IMarker", "MarkersParentModel", (IMarker, MarkersParentModel) ->
        class Markers extends IMarker
            constructor: ($timeout) ->
                super($timeout)
                @template = '<span class="angular-google-map-markers" ng-transclude></span>'
                @scope.idKey = '=idkey' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
                @scope.doRebuildAll = '=dorebuildall' #root level directive attribute not a model level, should default to false
                @scope.models = '=models'
                @scope.doCluster = '=docluster'
                @scope.clusterOptions = '=clusteroptions'
                @scope.clusterEvents = '=clusterevents'
                @scope.labelContent = '=labelcontent'
                @scope.labelAnchor = '@labelanchor'
                @scope.labelClass = '@labelclass'

                @$timeout = $timeout
                self = @
                @$log.info @

            controller: ['$scope', '$element', ($scope, $element) ->
                getMarkersScope: ->
                    $scope
            ]

            link: (scope, element, attrs, ctrl) =>
                new MarkersParentModel(scope, element, attrs, ctrl, @$timeout)
]
