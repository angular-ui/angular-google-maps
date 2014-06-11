angular.module("angular-google-maps-example", ["google-maps"]).value("rndAddToLatLon",function () {
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
          division: "US",
          type: "US",
          // coords:{
          latitude: 41.169444444444444,
          longitude: -75.87777777777778,
          driverCode: "GRIP",
          trailer: "  5555",
          status: "D",
          orderNumber: "9999999",
          destinationCityCode: "MT",
          destinationStateCode: "PA",
          contactCityCode: "PICK",
          contactStateCode: "ON",
          icon: undefined,
          id: "7"
        },
        {
            division: "US",
            type: "US",
            // coords:{
            latitude: 43.169444444444444,
            longitude: -75.87777777777778,
            driverCode: "GRIP",
            trailer: "  5555",
            status: "D",
            orderNumber: "9999999",
            destinationCityCode: "MT",
            destinationStateCode: "PA",
            contactCityCode: "PICK",
            contactStateCode: "ON",
            icon: undefined,
            id: "10"
          }
      ]
    ,
      dynamicMarkers: [],
      refresh: function () {
        $scope.map.control.refresh(origCenter);
      }
    }
  });

  $log.info("Markers: " + $scope.map.markers);
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
