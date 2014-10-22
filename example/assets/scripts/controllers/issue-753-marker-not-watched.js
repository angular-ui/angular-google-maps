angular.module("markerCoordsTest", ["google-maps".ns()])

.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
  GoogleMapApi.configure({
    v: '3.17',
    libraries: ''
  });
}])

.controller("TestController", function($scope, $interval) {
  var coords = {
    latitude: 45.0,
    longitude: 11.0
  };

  icon = undefined;

  $scope.map = {
    title: "A test map",
    center: {latitude: 45.0,longitude: 11.0},
    zoom: 15
  };

  $scope.marker = {
    id: "myMarker",
    coords: coords,
    icon: 'assets/images/blue_marker.png',
    options:{
      draggable: true,
      labelContent: "lat: " + coords.latitude + ' ' + 'lon: ' + coords.longitude,
      labelAnchor: "5 0",
      labelClass: "marker-labels"
    }
  };

  $scope.markers = [
    $scope.marker
  ];

  $interval(function() {
    if($scope.marker.icon)
      $scope.marker.icon = undefined;
    else
      $scope.marker.icon = 'assets/images/blue_marker.png';
    coords.latitude = coords.latitude + 0.0001;
    coords.longitude = coords.longitude + 0.0001;
    $scope.marker.options.labelContent = "lat: " + coords.latitude + ' ' + 'lon: ' + coords.longitude;
  }, 1500);
});
