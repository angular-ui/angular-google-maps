angular.module('appMaps', ['uiGmapgoogle-maps'])

  .controller("mapCtrl", ["$scope", "uiGmapLogger", function ($scope, logger) {
    logger.doLog = true;
    var lastId = 1;
    var clusterThresh = 6;

    $scope.map = {
      doCluster: false,
      options: {
        streetViewControl: false,
        panControl: false,
        maxZoom: 18,
        minZoom: 3
      },
      events: {
        idle: function () {
          if ($scope.map.zoom <= clusterThresh) {
            if (!$scope.map.doCluster) {
              $scope.map.doCluster = true;
              $scope.searchResults.results = [];
            }
          }
          else {
            if ($scope.map.doCluster) {
              $scope.map.doCluster = false;
              $scope.searchResults.results = [];
            }
          }
          $scope.addMarkers(1000);
        }
      },
      center: {
        latitude: 0,
        longitude: 0
      },
      zoom: 0
    };

    $scope.searchResults = {
      results: []
    };

//  $scope.$watch( 'zoom', function (newValue, oldValue){
//    if (newValue == oldValue)
//      return null;
//
//  });


    $scope.addMarkers = function (num) {
      var markers = [];
      var i = 0;

      for (i = 0; i < num; i++) {
        var cords = chance.coordinates().split(',');
//      if(markers.length < 100){
        markers.push({
          'coords': {
            'latitude': cords[0],
            'longitude': cords[1]
          },
          'key': 'someKey-' + lastId
        });
        lastId++;
//      }
      }
      lastId = 1;//reset
      $scope.searchResults.results = markers;
    };

    $scope.reset = function () {
      lastId = 1;
      $scope.searchResults = {
        results: []
      };
    };

  }
  ]);
