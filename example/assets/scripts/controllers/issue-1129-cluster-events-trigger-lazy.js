angular.module('app', ['uiGmapgoogle-maps'])
  .controller('MapCtrl', function ($scope, $timeout) {
    $scope.map = {
      center: {
        latitude: 50.087743,
        longitude: 14.478982
      },
      zoom: 8,
      options: {
        scrollwheel: true
      },
      clusterEvents: {
        click: function (cluster, clusterModels) {
          console.log("click cluster");
        },
        mouseout: function () {
          console.log("mouseout cluster");
        }
      },
      markers: []
    };

    $scope.find = function () {
      $scope.map.markers = [];
      $scope.map.markers.push({
        id: "neco1",
        coordinates: {
          latitude: 50.087743,
          longitude: 14.478982
        }
      });
      $scope.map.markers.push({
        id: "neco2",
        coordinates: {
          latitude: 50.087743,
          longitude: 14.478982
        }
      });
    };
//    $scope.find();
    $timeout(function(){
      $scope.find();
    }, 2000);

  });