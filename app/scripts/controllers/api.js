'use strict';

angular.module('angularGoogleMapsApp')
    .constant("directiveList", [
            'google-map',
            'circle',
            'layer',
            'marker',
            'marker-label',
            'markers',
            'polygon',
            'polyline',
            'polylines',
            'rectangle',
            'window',
            'windows'
        ]
    )
    .config(function($stateProvider, directiveList) {
        for (var i = 0; i < directiveList.length; i++) {
            var cur = directiveList[i];
            (function(cur) {
                $stateProvider
                    .state('api.' + cur, {
                        templateUrl: 'views/directive/' + cur + '.html'
                    })
            })(cur)
        }
    })
    .controller('ApiCtrl', function ($scope, $rootScope, $location, $state, directiveList) {
        if ($state.current.name === "api") {
            $state.go("api." + directiveList[0]);
        }

        $scope.directives = directiveList;
        $scope.current = directiveList[0];
        $scope.current = $state.$current.name;

        $rootScope.$on("$stateChangeSuccess", function(event, to) {
            $scope.current = $state.$current.name.substring(4);
        });

        $scope.viewUrl = function (directive) {
            return 'views/directive/' + directive + '.html';
        };

        $scope.query = null;

        $scope.$watch(function () {
            return $location.hash();
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $('#content' + newValue).collapse('show');
            }
        });
  });
