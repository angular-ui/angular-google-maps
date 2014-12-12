// Code goes here

angular.module('app', ['uiGmapgoogle-maps'])
  .controller('mainCtrl', function (uiGmapLogger, $scope, $timeout) {
    uiGmapLogger.currentLevel = uiGmapLogger.LEVELS.debug;

    $scope.number = 0;
    $scope.map = {
      center: {
        latitude: 35.027469,
        longitude: -111.022753
      },
      zoom: 4,
      markerModels: [
        {
          id: 0,
          coords: {
            latitude: 35.027469,
            longitude: -111.022753
          },
          options: {}
        },
        {
          id: 1,
          coords: {
            latitude: 38.027469,
            longitude: -120.022753
          },
          options: {}
        }
      ]
      //windowModel:{}
    };
    $scope.map.markerModels.forEach(function (m) {
      m.clicked = function (gMarker, eventName, markerModel) {
        if($scope.map.windowModel) {
          $scope.map.windowModel.show = false;
        }
        markerModel.show = true;
        $scope.map.windowModel = markerModel;
      }
    });

    //$timeout(function(){
    //  $scope.map.markerModels = [
    //    {
    //      id: 0,
    //      coords: {
    //        latitude: 35.027469,
    //        longitude: -111.022753
    //      },
    //      options: {}
    //    },
    //    {
    //      id: 1,
    //      coords: {
    //        latitude: 38.027469,
    //        longitude: -120.022753
    //      },
    //      options: {}
    //    }
    //  ]
    //});
  });