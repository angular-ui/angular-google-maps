angular.module("angular-google-maps-example", ['uiGmapgoogle-maps'])
.value("rndAddToLatLon", function () {
  return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1)
})
.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
  GoogleMapApi.configure({
    //    key: 'your api key',
    v: '3.16',
    libraries: 'weather,geometry,visualization'
  });
}])

.controller(
  "controller", ['$rootScope', '$scope', '$location', '$http','uiGmapGoogleMapApi',
  function ($rootScope, $scope, $location, $http, GoogleMapApi) {
    $scope.map = {
      center: {
        latitude: 51.219053,
        longitude: 4.404418
      },
      zoom: 15
    };

    $scope.test = {};
    $scope.test.name = true;
    $scope.windowOptions = {
      boxClass:"custom-info-window",
      disableAutoPan : true
    };
    $scope.windows = [{
        id: 1,
        latitude: 51.229053,
        longitude: 4.404418,
        show:true,
        options: {
          boxClass:"custom-info-window",
          disableAutoPan : true
        }
      }];

    GoogleMapApi.then(function(maps) {

    });
  }]);
