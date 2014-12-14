// Code goes here
angular.module('appMaps', ['uiGmapgoogle-maps'])
  .controller('mainCtrl', function ($scope, $log, $timeout) {
    $scope.map1 = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 };
    $scope.map2 = {center: {latitude: 42.1451, longitude: -97.6680 }, zoom: 4 };
    $scope.map3 = {center: {latitude: 45.1451, longitude: -92.6680 }, zoom: 4 };

  });
