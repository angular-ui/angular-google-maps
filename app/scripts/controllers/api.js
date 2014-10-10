'use strict';

angular.module('angularGoogleMapsApp')
  .constant("directiveList", [
    'google-map',
    'drawing-manager',
    'free-draw-polygons',
    'circle',
    'layer',
    'map-control',
    'marker',
    'marker-label',
    'markers',
    'polygon',
    'polyline',
    'polylines',
    'rectangle',
    'search-box',
    'window',
    'windows'
  ])
  .constant("providersList", [
    'GoogleMapApi'
  ])
  .config(function ($stateProvider, directiveList, providersList) {
    [
      {modules: directiveList, loc: 'directive/'},
      {modules: providersList, loc: 'provider/'}
    ].forEach(function (modsToLoc) {
        modsToLoc.modules.forEach(function (cur) {
          (function (cur) {
            $stateProvider.state('api.' + cur, {
              templateUrl: 'views/' + modsToLoc.loc + cur + '.html'
            })
          })(cur)
        })
      });
  })
  .controller('ApiCtrl', function ($scope, $rootScope, $location, $state, directiveList, providersList) {
    if ($state.current.name === "api") {
      $state.go("api." + providersList[0]);
    }
    $scope.providers = providersList;
    $scope.directives = directiveList;
    $scope.current = providersList[0];
    $scope.current = $state.$current.name;

    $rootScope.$on("$stateChangeSuccess", function (event, to) {
      $scope.current = $state.$current.name.substring(4);
    });

//    $scope.viewUrl = function (directive) {
//      return 'views/directive/' + directive + '.html';
//    };

    $scope.query = null;

    $scope.$watch(function () {
      return $location.hash();
    }, function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $('#content' + newValue).collapse('show');
      }
    });
  });
