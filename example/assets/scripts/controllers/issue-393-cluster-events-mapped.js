angular.module("angular-google-maps-example", ['uiGmapgoogle-maps']).value("rndAddToLatLon",function () {
  return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1)
}).controller("controller", function ($scope, $timeout, $log, $http, rndAddToLatLon) {
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
    map: {
      control: {},
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
      markers: [
        {
          id: 1,
          latitude: 45,
          longitude: -74,
          showWindow: false,
          title: 'Marker 2'
        },
        {
          id: 2,
          latitude: 15,
          longitude: 30,
          showWindow: false,
          title: 'Marker 2'
        },
        {
          id: 3,
          icon: 'assets/images/plane.png',
          latitude: 37,
          longitude: -122,
          showWindow: false,
          title: 'Plane'
        }
      ],
      markers2: [
        {
          id: 1,
          latitude: 46,
          longitude: -77,
          title: '[46,-77]'
        },
        {
          id: 2,
          latitude: 48,
          longitude: -79,
          title: '[33,-77]'
        },
        {
          id: 3,
          icon: 'assets/images/plane.png',
          latitude: 47,
          longitude: -78,
          title: '[35,-125]'
        }
      ],
      dynamicMarkers: [],
      refresh: function () {
        $scope.map.control.refresh(origCenter);
      }
    }
  });

  $scope.clusterEvents = {
    click: function (cluster, clusterModels) {
      alert("Cluster Models: clusterModels: " + JSON.stringify(clusterModels));
    }
  };

  $scope.refreshMap = function () {
    //optional param if you want to refresh you can pass null undefined or false or empty arg
    $scope.map.control.refresh({latitude: 32.779680, longitude: -79.935493});
    $scope.map.control.getGMap().setZoom(11);
  };
  $scope.getMapInstance = function () {
    alert("You have Map Instance of" + $scope.map.control.getGMap().toString());
  };

  var markerToClose = null;

  $scope.onMarkerClicked = function (marker) {
//    if (markerToClose) {
//      markerToClose.showWindow = false;
//    }
    markerToClose = marker; // for next go around
    marker.showWindow = true;
    $scope.$apply();
    //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
  };

  $scope.onInsideWindowClick = function () {
    alert("Window hit!");
  };

  $timeout(function () {
    var dynamicMarkers = [
      {   id: 1,
        latitude: 46,
        longitude: -79
      },
      {
        id: 2,
        latitude: 33,
        longitude: -79
      },
      {
        id: 3,
        icon: 'assets/images/plane.png',
        latitude: 35,
        longitude: -127
      }
    ];
    _.each(dynamicMarkers, function (marker) {
      marker.closeClick = function () {
        marker.showWindow = false;
        $scope.$apply();
      };
      marker.onClicked = function () {
        $scope.onMarkerClicked(marker);
      };
    });
    $scope.map.dynamicMarkers = dynamicMarkers;
  }, 2000);

  var origCenter = {latitude: $scope.map.center.latitude, longitude: $scope.map.center.longitude};
});
