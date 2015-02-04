angular.module('app', ['uiGmapgoogle-maps', 'ui-rangeSlider'])
.controller('MapCtrl', function ($scope, $http, $timeout, uiGmapIsReady) {

  console.log("MapCtrl called");

  $scope.project = {};
  $scope.project.locations = [];
  $scope.project.filtered_locations = [];

  //set up map starting from whole world in view
  $scope.project.map = {
    center: {
      latitude: 0,
      longitude: 0
    },
    zoom: 1
  };

  //set map options
  $scope.map_options = {
    // scrollwheel : false
  };

  $http.get('assets/json/1028-locations.json').
    success(function (data, status, headers, config) {
      console.log(data);

      //on map ready, add locations to scope to be rendered
      uiGmapIsReady.promise(1).then(function (instances) {

        $scope.project.locations = data;
        $scope.project.filtered_locations = data;

        // default the user's values to the available range
        $scope.minIndex = 0;
        $scope.maxIndex = data.length;

        console.log('maxIndex' + $scope.maxIndex);

        $scope.userMinIndex = $scope.minIndex;
        $scope.userMaxIndex = $scope.maxIndex;

        var delay = 500;
        var promise;

        $scope.$watch("userMaxIndex", function (newValue, oldValue) {

          var locations = [];

          $timeout.cancel(promise);
          promise = $timeout(function () {

            console.log("slider changed");

            locations = $scope.project.locations.slice($scope.userMinIndex, $scope.userMaxIndex);

            $scope.project.filtered_locations = locations;
            $scope.$apply();
            console.log("Locations on map are: " + $scope.project.filtered_locations.length);

          }, delay);
        });
      });
    }).
    error(function (data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
});