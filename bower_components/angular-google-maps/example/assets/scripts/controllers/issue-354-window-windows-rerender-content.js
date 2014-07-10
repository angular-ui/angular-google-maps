angular.module("angular-google-maps-example", ["google-maps"]).value("rndAddToLatLon", function () {
  return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1)
})
    .controller(
        "controller", ['$rootScope', '$scope', '$location', '$http',
          function ($rootScope, $scope, $location, $http) {
            $scope.map = {
              center: {
                latitude: 51.219053,
                longitude: 4.404418
              },
              zoom: 15
            };
            $scope.windowOptions = {disableAutoPan : true};
            $scope.windows = [
              {
                latitude: 51.229053,
                longitude: 4.404418,
                show:true
              }
            ]
            $scope.test = {};
            $scope.test.name = true;
          }]);