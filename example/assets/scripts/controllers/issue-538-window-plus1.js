// Code goes here

angular.module('app', ['google-maps'])
    .controller('mainCtrl', ['$scope', function($scope) {
      $scope.number = 0;
      $scope.map = {
        center: {
          latitude: 40.1451,
          longitude: -99.6680
        },
        zoom: 4,
        marker: {
          coords: {
            latitude: 40.1451,
            longitude: -99.6680
          }
        }
      };
      $scope.click = function() {
        $scope.number += 1;
      }
    }]);