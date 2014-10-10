'use strict';

angular.module('angularGoogleMapsApp').controller('DemoCtrl', function ($scope, $timeout) {

  $scope.tab = 'status';

  $scope.map = {
    center: {
      latitude: 40.47,	// NYC
      longitude: -73.85	// NYC
    },
    zoom: 8,
    markers: [
      {
        id: 0,
        coords: {
          latitude: 41,
          longitude: -75
        },
        title: 'Marker 1'
      },
      {
        id: 1,
        coords: {
          latitude: 40,
          longitude: -74.5
        },
        title: 'Marker 2'
      }
    ],
    polyline: {
      path: [
        {
          latitude: 41,
          longitude: -75
        },
        {
          latitude: 40,
          longitude: -74.5
        },
        {
          latitude: 40.47,
          longitude: -73.85
        },
        {
          latitude: 41.2,
          longitude: -74.2
        }
      ],
      clickable: true,
      editable: true,
      geodesic: true,
      draggable: true
    }
  };

  $timeout(function () {
    $scope.map.markers.push({
      id: 3,
      coords: {
        latitude: 40.2,
        longitude: -74.3
      },
      title: 'Marker 3'
    });
  }, 4000);
});
