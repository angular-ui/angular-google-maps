angular.module("angular-google-maps-example", ['uiGmapgoogle-maps'])
.controller("controller", function ($scope, $timeout, $log, $http) {

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
      dynamicMarkers: [],
      refresh: function () {
        $scope.map.control.refresh(origCenter);
      }
    }
  });
  $scope.removeMarkers = function () {
    $log.info("Clearing markers. They should disappear from the map now");
    $scope.map.markers.length = 0;
    $scope.map.markers2.length = 0;
    $scope.map.dynamicMarkers.length = 0;
    $scope.map.randomMarkers.length = 0;
    $scope.map.mexiMarkers.length = 0;
    $scope.map.polylines.length = 0;
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
  };
  $scope.getMapInstance = function () {
    alert("You have Map Instance of" + $scope.map.control.getGMap().toString());
  };

  var markerToClose = null;

  $scope.onInsideWindowClick = function(){
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
