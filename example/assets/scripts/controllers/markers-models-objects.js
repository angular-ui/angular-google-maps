angular.module('appMaps', ['uiGmapgoogle-maps'])

  .controller("mapCtrl", ["$scope", "uiGmapLogger", "uiGmapObjectIterators",
    function ($scope, logger, uiGmapObjectIterators) {
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
        clusterOptions: {},
        zoom: 0
      };

      $scope.searchResults = {
        results: {
          length: 0
        }
      };


      $scope.addMarkers = function (num) {
        var markers = {};
        var i = 0;

        for (i = 0; i < num; i++) {
          var cords = chance.coordinates().split(',');
          markers['someKey-' + lastId] ={
            'coords': {
              'latitude': cords[0],
              'longitude': cords[1]
            },
            'key': 'someKey-' + lastId
          };
          lastId++;
        }
        lastId = 1;//reset
        markers.length = num;

        $scope.searchResults.results = uiGmapObjectIterators.slapAll(markers);
      };

      $scope.reset = function () {
        lastId = 1;
        $scope.searchResults = {
          results: {
            length: 0
          }
        };
      };

    }
  ]);
