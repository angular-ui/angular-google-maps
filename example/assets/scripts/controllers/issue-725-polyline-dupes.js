var myapp = angular.module('app', [
  'google-maps'.ns()
])

myapp.controller('TestingCtrl', function ($scope) {


  $scope.trailExists = false;

  $scope.map = {

    centerProperty: {
      latitude: 38.23818,
      longitude: -96.328125
    },

    zoomProperty: 4,

    waterfall: {
      latitude: 35,
      longitude: -90,
      opts: {
        draggable: true
      },
      events: {
        dragend: function (marker) {
          $scope.$apply(function () {
            $scope.map.waterfall.latitude = marker.getPosition().lat().toFixed(5);
            $scope.map.waterfall.longitude = marker.getPosition().lng().toFixed(5);
          });

        }
      }
    },

    parking: {
      latitude: 40,
      longitude: -95,
      opts: {
        draggable: true
      },
      events: {
        dragend: function (marker) {
          $scope.$apply(function () {
            $scope.map.parking.latitude = marker.getPosition().lat().toFixed(5);
            $scope.map.parking.longitude = marker.getPosition().lng().toFixed(5);
          });
        }
      }
    },

    trails: {
      id: $scope.trailID,
      path: [
        {
          latitude: -100,
          longitude: -100
        },
        {
          latitude: -100,
          longitude: -100
        }
      ],
      stroke: {
        color: '#328ecc',
        weight: 3
      },
      editable: true,
      draggable: false,
      geodesic: false,
      visible: false
    }

  }; //scope map

  $scope.drawTrail = function () {
    if (!$scope.trailExists) {
      if (($scope.map.waterfall.latitude != '-100') && ($scope.map.parking.latitude != '-100')) {
        var trail = {};
        $scope.trailExists = true;
        trail = {
          id: $scope.trailID,
          path: [
            {
              latitude: $scope.map.waterfall.latitude,
              longitude: $scope.map.waterfall.longitude
            },
            {
              latitude: $scope.map.parking.latitude,
              longitude: $scope.map.parking.longitude
            }
          ],
          stroke: {
            color: '#328ecc',
            weight: 3
          },
          editable: true,
          draggable: false,
          geodesic: false,
          visible: true
        };

        $scope.map.trails = trail;
      } else {
        messageService.newMessage('Please include waterfall and parking coordinates before attempting to add the trail.', 'error', 5);
      }
    } else {
      messageService.newMessage('There is already a trail on the map.', 'error', 5);
    }
  };

  $scope.removeTrail = function () {
    console.log('Destroying trailID: ' + $scope.trailID);
    $scope.map.trails.path = [];
    delete $scope.map.trails[$scope.trailID];
    $scope.trailExists = false;
    $scope.trailID++;
  };

});
