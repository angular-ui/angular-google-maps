angular.module("angular-google-maps-example", ["google-maps"]).value("rndAddToLatLon",function () {
  return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1)
}).controller("controller",
    function ($scope, $timeout, $log, $http, rndAddToLatLon, Logger) {
      Logger.doLog = true
      // Enable the new Google Maps visuals until it gets enabled by default.
      // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
      google.maps.visualRefresh = true;

      var versionUrl = window.location.host === "rawgithub.com" ? "http://rawgithub.com/nlaplante/angular-google-maps/master/package.json" : "/package.json";

      $http.get(versionUrl).success(function (data) {
        if (!data)
          console.error("no version object found!!");
        $scope.version = data.version;
      });

      angular.extend($scope, {
        example2: {
          doRebuildAll: false
        },
        clickWindow: function () {
          $log.info('CLICK CLICK');
          Logger.info('CLICK CLICK');
        },
        map: {
          control: {},
          version: "uknown",

          center: {
            latitude: 45,
            longitude: -73
          },
          options: {
            streetViewControl: false,
            panControl: false,
            maxZoom: 20,
            minZoom: 3
          },
          zoom: 3,
          dragging: false,
          bounds: {},


          events: {
            tilesloaded: function (map, eventName, originalEventArgs) {
            }
          },
          circles: [
            {
              id: 1,
              center: {
                latitude: 44,
                longitude: -108
              },
              radius: 500000,
              stroke: {
                color: '#08B21F',
                weight: 2,
                opacity: 1
              },
              fill: {
                color: '#08B21F',
                opacity: 0.5
              },
              geodesic: true, // optional: defaults to false
              draggable: true, // optional: defaults to false
              clickable: true, // optional: defaults to true
              editable: true, // optional: defaults to false
              visible: true // optional: defaults to true
            }
          ],
          polygons: [
            {
              id: 1,
              path: [
                {
                  latitude: 50,
                  longitude: -80
                },
                {
                  latitude: 30,
                  longitude: -120
                },
                {
                  latitude: 20,
                  longitude: -95
                }
              ],
              stroke: {
                color: '#6060FB',
                weight: 3
              },
              editable: true,
              draggable: true,
              geodesic: false,
              visible: true,
              fill: {
                color: '#ff0000',
                opacity: 0.8
              }
            },
            {
              id: 2,
              path: [
                {
                  latitude: 60,
                  longitude: -80
                },
                {
                  latitude: 40,
                  longitude: -120
                },
                {
                  latitude: 45,
                  longitude: -95
                }
              ],
              stroke: {
                color: '#33CDDC',
                weight: 3
              },
              editable: true,
              draggable: true,
              geodesic: false,
              visible: true,
              fill: {
                color: '#33CCCC',
                opacity: 0.8
              }
            }
          ],
          polylines: [
            {
              id: 1,
              path: [
                {
                  latitude: 45,
                  longitude: -74
                },
                {
                  latitude: 30,
                  longitude: -89
                },
                {
                  latitude: 37,
                  longitude: -122
                },
                {
                  latitude: 60,
                  longitude: -95
                }
              ],
              stroke: {
                color: '#6060FB',
                weight: 3
              },
              editable: true,
              draggable: true,
              geodesic: true,
              visible: true
            },
            {
              id: 2,
              path: [
                {
                  latitude: 47,
                  longitude: -74
                },
                {
                  latitude: 32,
                  longitude: -89
                },
                {
                  latitude: 39,
                  longitude: -122
                },
                {
                  latitude: 62,
                  longitude: -95
                }
              ],
              stroke: {
                color: '#6060FB',
                weight: 3
              },
              editable: true,
              draggable: true,
              geodesic: true,
              visible: true
            }
          ]
        },
        toggleColor: function (color) {
          return color == 'red' ? '#6060FB' : 'red';
        }

      });


      $scope.refreshMap = function () {
        //optional param if you want to refresh you can pass null undefined or false or empty arg
        $scope.map.control.refresh({latitude: 32.779680, longitude: -79.935493});
        $scope.map.control.getGMap().setZoom(11);
        return;
      };
      $scope.getMapInstance = function () {
        alert("You have Map Instance of" + $scope.map.control.getGMap().toString());
        return;
      }

      $timeout(function () {

        //go nuts // PLEASE KEEP THIS AS IT TESTS POLYLINES SPEED!
//        var lastPolyline =  $scope.map.polylines[1];
//        $scope.map.polylines = _.map(_.range(500), function (i) {
//          var newPath = _.map(lastPolyline.path, function (p) {
//            return {
//              latitude: p.latitude,
//              longitude: p.longitude + 1
//            };
//          });
//          var newPoly = _.clone(lastPolyline);
//          newPoly.id = i + 1;
//          newPoly.path = newPath;
//          lastPolyline = newPoly;
//          return newPoly;
//        });

        $scope.map.polylines.push({
          id: 3,
          path: [
            {
              latitude: 65,
              longitude: -74
            },
            {
              latitude: 50,
              longitude: -89
            },
            {
              latitude: 57,
              longitude: -122
            },
            {
              latitude: 20,
              longitude: -95
            }
          ],
          stroke: {
            color: '#FF0066',
            weight: 3
          },
          editable: true,
          draggable: true,
          geodesic: true,
          visible: true
        });

      }, 2000);
    }
);
