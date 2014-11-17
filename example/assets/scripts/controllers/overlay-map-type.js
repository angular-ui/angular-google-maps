(function () {
  function getNormalizedCoord(coord, zoom) {
    var y = coord.y;
    var x = coord.x;
    var tileRange = 1 << zoom;
    if (y < 0 || y >= tileRange) {
      return null;
    }
    if (x < 0 || x >= tileRange) {
      x = (x % tileRange + tileRange) % tileRange;
    }
    return {x: x, y: y};
  }

  var module = angular.module('angular-google-maps-example', ['uiGmapgoogle-maps']);
  module.controller('maptypeExampleController',
    function ($scope, $http) {
      // Create custom map types
      $scope.squaresMapType = {
        getTile: function (coord, zoom, ownerDocument) {
          var div = ownerDocument.createElement('div');
          div.innerHTML = coord;
          div.style.width = this.tileSize.width + 'px';
          div.style.height = this.tileSize.height + 'px';
          div.style.fontSize = '10';
          div.style.borderStyle = 'solid';
          div.style.borderWidth = '1px';
          div.style.borderColor = '#AAAAAA';
          return div;
        },
        tileSize: new google.maps.Size(256, 256),
        name: 'Black Squares',
        // maxZoom is a mandatory property in case where you use maptype as a single layer
        maxZoom: 19,
      };

      $scope.mosconeCenterMapType = {
        getTileUrl: function (coord, zoom) {
          var bounds = {
            17: [
              [20969, 20970],
              [50657, 50658]
            ],
            18: [
              [41939, 41940],
              [101315, 101317]
            ],
            19: [
              [83878, 83881],
              [202631, 202634]
            ],
            20: [
              [167757, 167763],
              [405263, 405269]
            ]
          };

          if (zoom < 17 || zoom > 20 ||
            bounds[zoom][0][0] > coord.x || coord.x > bounds[zoom][0][1] ||
            bounds[zoom][1][0] > coord.y || coord.y > bounds[zoom][1][1]) {
            return null;
          }

          return [
            'http://www.gstatic.com/io2010maps/tiles/5/L2_', zoom, '_',
            coord.x, '_', coord.y, '.png'
          ].join('');
        },
        tileSize: new google.maps.Size(256, 256)
      };

      $scope.moonMapType = {
        getTileUrl: function (coord, zoom) {
          var normalizedCoord = getNormalizedCoord(coord, zoom);
          if (!normalizedCoord) {
            return null;
          }
          var bound = Math.pow(2, zoom);
          return 'http://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw' +
            '/' + zoom + '/' + normalizedCoord.x + '/' +
            (bound - normalizedCoord.y - 1) + '.jpg';
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 9,
        minZoom: 0,
        radius: 1738000,
        name: 'Moon'
      };

      // Map instances controlers
      $scope.map1 = {
        center: {
          latitude: 41.850033,
          longitude: -87.6500523
        },
        showOverlay: true,
        zoom: 10,
      };

      $scope.map2 = {
        center: {
          latitude: 37.78313383212,
          longitude: -122.4039494991302
        },
        zoom: 18,
        options: {
          minZoom: 17,
          maxZoom: 20
        }
      };

      $scope.map3 = {
        center: {
          latitude: 0,
          longitude: 0
        },
        zoom: 1,
        options: {
          mapTypeId: 'moon',
          mapTypeControlOptions: {
            mapTypeIds: ['moon']
          }
        }
      };

      $scope.map4 = {
        center: {
          latitude: 0,
          longitude: 0
        },
        zoom: 3,
        options: {
          mapTypeControlOptions: {
            mapTypeIds: ['moon', google.maps.MapTypeId.ROADMAP]
          }
        }
      };

      // Other actions
      var versionUrl = window.location.host === 'rawgithub.com' ?
        'http://rawgithub.com/angular-ui/angular-google-maps/master/package.json' : '/package.json';
      $http.get(versionUrl).success(function (data) {
        if (!data && console) {
          console.error('no version object found!!');
        }
        $scope.version = data.version;
      });
    });
}());
