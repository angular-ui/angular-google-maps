angular.module("markerCoordsTest", ['ngRoute','uiGmapgoogle-maps'])

.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
  GoogleMapApi.configure({
    v: '3.17',
    libraries: ''
  });
}])

.config(['$routeProvider',
function($routeProvider) {
    return $routeProvider
    .when('/map', {
      templateUrl: 'assets/templates/issue-755-ng-router.html',
      controller: 'TestController'
    }).when('/msgs', {
      template: '<div>HI!</div>',
    });
  }
])

.controller("TestController", function($scope, $interval) {
  var coords = {
    latitude: 45.0,
    longitude: 11.0
  };

  icon = undefined;

  $scope.map = {
    title: "A test map",
    center: coords,
    zoom: 15,
  };

  $scope.marker = {
    id: "myMarker",
    coords: coords,
    icon: 'assets/images/blue_marker.png'
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
  }, 1500);
});
