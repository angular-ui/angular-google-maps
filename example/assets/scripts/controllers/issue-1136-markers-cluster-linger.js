angular.module('appMaps', ['uiGmapgoogle-maps'])

  .controller("mapCtrl", ["$scope", "uiGmapLogger", function ($scope, logger) {
    logger.doLog = true;
    logger.currentLevel = logger.LEVELS.debug;
    var lastId = 1;
    var clusterThresh = 6;

    $scope.map = {
      actualZoom: null,
      showMarkers: true,
      doCluster: true,
      options: {
        streetViewControl: false,
        panControl: false,
        maxZoom: 18,
        minZoom: 3
      },
      markerControl: {},
      events: {
        idle: function (map) {
          $scope.map.actualZoom = map.getZoom();
          if ($scope.addMarkers)
            $scope.addMarkers(1000);
        }
      },
      center: {
        latitude: 0,
        longitude: 0
      },
      clusterOptions: {},
      zoom: 0
    };

    $scope.searchResults = {
      results: []
    };


    $scope.addMarkers = function (num) {
      var markers = [];
      var i = 0;

      for (i = 0; i < num; i++) {
        var cords = chance.coordinates().split(',');
        markers.push({
          'coords': {
            'latitude': cords[0],
            'longitude': cords[1]
          },
          'key': 'someKey-' + lastId
        });
        lastId++;
      }
      $scope.searchResults.results = $scope.searchResults.results.concat(markers);
    };

    $scope.forceClusterDraw = function(){
      $scope.map.markerControl.managerDraw();
    };


    $scope.reset = function () {
      lastId = 1;
      $scope.searchResults.results.length = 0;
//      $scope.searchResults = {
//        results: []
//      };
    };

  }
  ]);
