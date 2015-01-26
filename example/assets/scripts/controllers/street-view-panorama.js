angular.module('app', ['uiGmapgoogle-maps'])
.controller('ctrl', ['$scope', "uiGmapLogger", "uiGmapGoogleMapApi", "$http",
  function ($scope, $log, uiGmapGoogleMapApi, $http) {
    $scope.map = {
      id: 1,
      center: {
        latitude: 38.889484,
        longitude: -77.035279
      },
      zoom: 16,
      refresh: false,
      events: {},
      bounds: {},
      draw: undefined
    };
    $scope.map.marker = _.extend({}, $scope.map.center);
}])
.controller('PanCtrl',function(){

});

