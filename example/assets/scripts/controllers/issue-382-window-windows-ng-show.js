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

  $scope.map = {
    center: {
      latitude: 51.219053,
      longitude: 4.404418
    },
    zoom: 15
  };

  $scope.markersClick = function (m) {

  };
  $scope.map.markers = [
    {
      wonkyId:0,
      longitude: 4.404418,
      latitude: 51.219053
    }
  ];
})
.controller('winCtrl', ['$rootScope', '$scope', '$location', '$http',
  function ($rootScope, $scope, $location, $http) {
    $scope.showSpan = true;
  }]);
