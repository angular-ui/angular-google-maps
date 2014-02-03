angular.module("google-maps")
.factory "Marker", ["IMarker", "MarkerParentModel", (IMarker, MarkerParentModel) ->
        class Marker extends IMarker
            constructor: ($timeout) ->
                super($timeout)
                self = @
                @template = '<span class="angular-google-map-marker" ng-transclude></span>'
                @$log.info(@)

            controller: ['$scope', '$element', ($scope, $element) ->
                getMarkerScope: ->
                    $scope
            ]
            link: (scope, element, attrs, ctrl) =>
                new MarkerParentModel(scope, element, attrs, ctrl, @$timeout)
        Marker
]