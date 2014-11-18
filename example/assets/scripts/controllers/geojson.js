(function () {
  var module = angular.module("angular-google-maps-example", ['uiGmapgoogle-maps']);
}());

var rndAddToLatLon = function () {
  return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1)
}

function ExampleController($scope, $timeout, $log, $http, uiGmapLogger) {
  uiGmapLogger.doLog = true
  // Enable the new Google Maps visuals until it gets enabled by default.
  // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
  google.maps.visualRefresh = true;

  var versionUrl = window.location.host === "rawgithub.com" ? "http://rawgithub.com/nlaplante/angular-google-maps/master/package.json" : "/package.json";

  $http.get(versionUrl).success(function (data) {
    if (!data)
      console.error("no version object found!!");
    $scope.version = data.version;
  });

  var onMarkerClicked = function (marker) {
    marker.showWindow = true;
    //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
  };

  var genRandomMarkers = function (numberOfMarkers, scope) {
    var markers = [];
    for (var i = 0; i < numberOfMarkers; i++) {
      markers.push(createRandomMarker(i, scope.map.bounds));
    }

    scope.map.randomMarkers = markers;
  };

  var createRandomMarker = function (i, bounds, idKey) {
    var lat_min = bounds.southwest.latitude,
      lat_range = bounds.northeast.latitude - lat_min,
      lng_min = bounds.southwest.longitude,
      lng_range = bounds.northeast.longitude - lng_min;

    if (idKey == null)
      idKey = "id";

    var latitude = lat_min + (Math.random() * lat_range);
    var longitude = lng_min + (Math.random() * lng_range);
    var ret = {
      geometry: {
        type: "Point",
        coordinates: [ longitude, latitude ]
      },
      title: 'm' + i
    };
    ret[idKey] = i;
    return ret;
  };

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
      heatLayerCallback: function (layer) {
        //set the heat layers backend data
        var mockHeatLayer = new MockHeatLayer(layer);
      },
      showTraffic: true,
      showBicycling: false,
      showWeather: false,
      showHeat: false,
      center: {
        type: "Point",
        coordinates: [ -73, 45 ]
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
      markers: [
        {
          id: 1,
          geometry: {
            type: "Point",
            coordinates: [ -74, 45 ]
          },
          showWindow: false,
          title: 'Marker 2'
        },
        {
          id: 2,
          geometry: {
            type: "Point",
            coordinates: [ 30, 15 ]
          },
          showWindow: false,
          title: 'Marker 2'
        },
        {
          id: 3,
          icon: 'assets/images/plane.png',
          geometry: {
            type: "Point",
            coordinates: [ -122, 37 ]
          },
          showWindow: false,
          title: 'Plane'
        }
      ],
      markers2: [
        {
          id: 1,
          geometry: {
            type: "Point",
            coordinates: [ -77, 46 ]
          },
          showWindow: false,
          title: '[46,-77]'
        },
        {
          id: 2,
          geometry: {
            type: "Point",
            coordinates: [ -77, 33 ]
          },
          showWindow: false,
          title: '[33,-77]'
        },
        {
          id: 3,
          icon: 'assets/images/plane.png',
          geometry: {
            type: "Point",
            coordinates: [ -125, 35 ]
          },
          showWindow: false,
          title: '[35,-125]'
        }
      ],
      mexiIdKey: 'mid',
      mexiMarkers: [
        {
          mid: 1,
          geometry: {
            type: "Point",
            coordinates: [ -106.248779, 29.302567 ]
          }
        },
        {
          mid: 2,
          geometry: {
            type: "Point",
            coordinates: [ -109.434814, 30.369913 ]
          }
        },
        {
          mid: 3,
          geometry: {
            type: "Point",
            coordinates: [ -108.61084, 26.739478 ]
          }
        }
      ],
      dynamicMarkers: [],
      randomMarkers: [],
      doClusterRandomMarkers: true,
      doUgly: true, //great name :)
      clusterOptions: {title: 'Hi I am a Cluster!', gridSize: 60, ignoreHidden: true, minimumClusterSize: 2,
        imageExtension: 'png', imagePath: 'assets/images/cluster', imageSizes: [72]},
      clickedMarker: {
        id: 0,
        title: 'You clicked here',
        geometry: {
          type: "Point",
          coordinates: [ ]
        }
      },
      events: {
        tilesloaded: function (map, eventName, originalEventArgs) {
        },
        click: function (mapModel, eventName, originalEventArgs) {
          // 'this' is the directive's scope
          $log.log("user defined event: " + eventName, mapModel, originalEventArgs);

          var e = originalEventArgs[0];
          $scope.map.clickedMarker = {
            id: 0,
            title: 'You clicked here ' + 'lat: ' + e.latLng.lng() + ' lon: ' + e.latLng.lng(),
            geometry: {
              type: "Point",
              coordinates: [ e.latLng.lng(), e.latLng.lat() ]
            }
          };
          //scope apply required because this event handler is outside of the angular domain
          $scope.$apply();
        },
        dragend: function () {
          self = this;
          $timeout(function () {
            var markers = [];
            var id = 0;
            if ($scope.map.mexiMarkers !== null && $scope.map.mexiMarkers.length > 0) {
              var maxMarker = _.max($scope.map.mexiMarkers, function (marker) {
                return marker.mid;
              });
              id = maxMarker.mid;
            }
            for (var i = 0; i < 4; i++) {
              id++;
              markers.push(createRandomMarker(id, $scope.map.bounds, "mid"));
            }
            $scope.map.mexiMarkers = markers.concat($scope.map.mexiMarkers);
          });
        }
      },
      infoWindow: {
        coords: {
          type: "Point",
          coordinates: [ -44.296875, 36.270850 ]
        },
        options: {
          disableAutoPan: true
        },
        show: false
      },
      infoWindowWithCustomClass: {
        coords: {
          type: "Point",
          coordinates: [ -44.296875, 36.270850 ]
        },
        options: {
          boxClass: 'custom-info-window'
        },
        show: true
      },
      templatedInfoWindow: {
        coords: {
          type: "Point",
          coordinates: [ -75.937500, 48.654686 ]
        },
        options: {
          disableAutoPan: true
        },
        show: true,
        templateUrl: 'assets/templates/info.html',
        templateParameter: {
          message: 'passed in from the opener'
        }
      },
      circles: [
        {
          id: 1,
          center: {
            type: "Point",
            coordinates: [ -108, 44 ]
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
          path: {
            type: "Polygon",
            coordinates: [
              [
                [ -80, 50 ],
                [ -120, 30 ],
                [ -95, 20 ],
                [ -80, 50 ]
              ]
            ]
          },
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
        }
      ],
      polylines: [
        {
          id: 1,
          path: {
            type: "LineString",
            coordinates: [
              [ -74, 45 ],
              [ -89, 30 ],
              [ -122, 37 ],
              [ -95, 60 ]
            ]
          },
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

  _.each($scope.map.markers, function (marker) {
    marker.closeClick = function () {
      marker.showWindow = false;
      $scope.$apply();
    };
    marker.onClicked = function () {
      onMarkerClicked(marker);
    };
  });

  _.each($scope.map.markers2, function (marker) {
    marker.closeClick = function () {
      marker.showWindow = false;
      $scope.$apply();
    };
    marker.onClicked = function () {
      onMarkerClicked(marker);
    };
  });

  $scope.removeMarkers = function () {
    $log.info("Clearing markers. They should disappear from the map now");
    $scope.map.markers = [];
    $scope.map.markers2 = [];
    $scope.map.dynamicMarkers = [];
    $scope.map.randomMarkers = [];
    $scope.map.mexiMarkers = [];
    $scope.map.polylines = [];
    $scope.map.clickedMarker = null;
    $scope.searchLocationMarker = null;
    $scope.map.infoWindow.show = false;
    $scope.map.templatedInfoWindow.show = false;
    // $scope.map.infoWindow.coords = null;
  };
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
  $scope.map.clusterOptionsText = JSON.stringify($scope.map.clusterOptions);
  $scope.$watch('map.clusterOptionsText', function (newValue, oldValue) {
    if (newValue !== oldValue)
      $scope.map.clusterOptions = angular.fromJson($scope.map.clusterOptionsText);
  });

  $scope.$watch('map.doUgly', function (newValue, oldValue) {
    var json;
    if (newValue !== oldValue) {
      if (newValue)
        json = {title: 'Hi I am a Cluster!', gridSize: 60, ignoreHidden: true, minimumClusterSize: 2,
          imageExtension: 'png', imagePath: 'http://localhost:3000/example/cluster', imageSizes: [72]};
      else
        json = {title: 'Hi I am a Cluster!', gridSize: 60, ignoreHidden: true, minimumClusterSize: 2};
      $scope.map.clusterOptions = json;
      $scope.map.clusterOptionsText = angular.toJson(json);
    }
  });

  $scope.genRandomMarkers = function (numberOfMarkers) {
    genRandomMarkers(numberOfMarkers, $scope);
  };

  $scope.searchLocationMarker = {
    id: 0,
    title:'searchLocationMarker',
    geometry: {
      type: "Point",
      coordinates: [ -99.6680, 40.1451 ]
    },
    options: { draggable: true },
    events: {
      dragend: function (marker, eventName, args) {
        $log.log('marker dragend');
        $log.log(marker.getPosition().lat());
        $log.log(marker.getPosition().lng());
      }
    }
  }
  $scope.onMarkerClicked = onMarkerClicked;

  $timeout(function () {
    $scope.map.infoWindow.show = true;
    dynamicMarkers = [
      {
        id: 1,
        geometry: {
          type: "Point",
          coordinates: [ -79, 46 ]
        },
        showWindow: false
      },
      {
        id: 2,
        geometry: {
          type: "Point",
          coordinates: [ -79, 33 ]
        },
        showWindow: false
      },
      {
        id: 3,
        icon: 'assets/images/plane.png',
        geometry: {
          type: "Point",
          coordinates: [ -127, 35 ]
        },
        showWindow: false
      }
    ];

    $scope.map.polylines.push({
      id: 3,
      path: {
        type: "LineString",
        coordinates: [
          [ -74, 65 ],
          [ -89, 50 ],
          [ -122, 57 ],
          [ -95, 20 ]
        ]
      },
      stroke: {
        color: '#FF0066',
        weight: 3
      },
      editable: true,
      draggable: true,
      geodesic: true,
      visible: true
    });

    $scope.map.polylines = $scope.map.polylines.slice(1);
    _.each(dynamicMarkers, function (marker) {
      marker.closeClick = function () {
        marker.showWindow = false;
      };
      marker.onClicked = function () {
        onMarkerClicked(marker);
      };
    });
    $scope.map.dynamicMarkers = dynamicMarkers;
  }, 2000);
}
