angular.module('appMaps', ['uiGmapgoogle-maps'])

  .controller("mapCtrl", ["$scope", "uiGmapLogger", function ($scope, logger) {
    logger.doLog = true;
    logger.currentLevel = logger.LEVELS.debug;
    var lastId = 1;
    var clusterThresh = 6;

    $scope.map = {
      doCluster: true,
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
      //clusterOptions: {title: 'Hi I am a Cluster!', gridSize: 60, ignoreHidden: true, minimumClusterSize: 2,
      //  imageExtension: 'png', imagePath: 'assets/images/cluster', imageSizes: [72]
      //},
      clusterOptions: {},
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
