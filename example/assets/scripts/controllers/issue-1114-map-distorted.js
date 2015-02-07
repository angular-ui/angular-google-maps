angular.module('app', ['uiGmapgoogle-maps'])
.controller('MapsCtrl', ['$timeout','$scope', "uiGmapLogger", "uiGmapGoogleMapApi",
  function ($timeout, $scope, $log, GoogleMapApi) {
    $log.currentLevel = $log.LEVELS.debug;
    $scope.refresh = function(){
      if ($scope.map.control.refresh)
        $scope.map.control.refresh();
    };

    $scope.map = {
      show: false,
      center: {
        latitude: 26.153215225012733,
        longitude: -81.80121597097774
      },
      control: {},
      pan: true,
      zoom: 16,
      refresh: false,
      events: {},
      bounds: {}
    };

  }]);