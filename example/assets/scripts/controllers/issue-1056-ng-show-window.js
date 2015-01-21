angular.module('appMaps', ['uiGmapgoogle-maps'])
  .controller('mapCtrl', function ($scope) {
    $scope.map = {
      center: {
        longitude: 4.404418,
        latitude: 51.219053
      },
      zoom: 10,
      control: {},
      markers: [
        {
          wonkyId: 0,
          longitude: 4.404418,
          latitude: 51.219053,
          showSpan: true
        },
        {
          wonkyId: 0,
          longitude: 4.5044,
          latitude: 51.40,
          showSpan: false
        }
      ]
    };
  });