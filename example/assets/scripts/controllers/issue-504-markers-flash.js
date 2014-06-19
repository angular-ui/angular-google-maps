angular.module('testApp', ['google-maps']).controller('TestController', ['$scope', function ($scope) {
  $scope.map = {
    center: {
      latitude: 45,
      longitude: -73
    },
    zoom: 3
  };
  var ICONS = {
    test: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Go-home.svg/48px-Go-home.svg.png',
    test1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Go-up.svg/48px-Go-up.svg.png'
  };
  $scope.sites = [
    {coords: {longitude: 25, latitude: -25}, site_id: 0, icon: ICONS['test']},
    {coords: {longitude: 25, latitude: 25}, site_id: 1, icon: ICONS['test']},
    {coords: {longitude: -25, latitude: -25}, site_id: 2, icon: ICONS['test']},
    {coords: {longitude: -25, latitude: 25}, site_id: 3, icon: ICONS['test']}
  ].map(function (site) {
        site.click = function () {
          site.icon = ICONS['test1'];
          $scope.$apply();
        };
        return site;
      });


}]);