angular.module('app', ['google-maps'.ns()])
.controller('ctrl', [ '$scope', 'Logger'.ns(),'$timeout',
function ($scope, $log, $timeout) {
  $log.doLog = true;
  $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 }
  $scope.options = {scrollwheel: false};
  $scope.coordsUpdates = 0;
  $scope.dynamicMoveCtr = 0;
  $scope.marker = {
    id: 0,
    icon:"assets/images/blue_marker.png",
    coords: {
      latitude: 40.1451,
      longitude: -99.6680
    },
    options: { draggable: true },
    events: {
      dragend: function (marker, eventName, args) {
        $log.log('marker dragend');
        var lat = marker.getPosition().lat();
        var lon = marker.getPosition().lng();
        $log.log(lat);
        $log.log(lon);

        $scope.marker.options = {
          draggable: true,
          labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
          labelAnchor: "100 0",
          labelClass: "marker-labels"
        };
        $scope.$apply();
        $log.log('$apply()');
      }
    }
  };

  $scope.markers = [
  {
    id: 0,
    coords: {
      latitude: 37.1451,
      longitude: -80.6680
    },
    options: { draggable: true },
  },
  {
    id: 1,
    coords: {
      latitude: 36.1451,
      longitude: -85.6680
    },
    show:true,
    options: { draggable: true,
      labelContent: "Drag Me",
      labelAnchor: "20 -10",
      labelClass: "marker-labels"
    },
  }
  ];

  $scope.$watchCollection("marker.coords",function(newVal,oldVal){
    if(_.isEqual(newVal,oldVal))
      return;
      $scope.coordsUpdates++;
    });
    $timeout(function(){
      $scope.marker.coords = {
        latitude: 42.1451,
        longitude: -100.6680
      };
      $scope.dynamicMoveCtr++;

      $scope.markers.push(  {
        id: 3,
        coords: {
          latitude: 50.1451,
          longitude: -85.6680
        },
        show:true,
        options: { draggable: true,
          labelContent: "Drag Me 3",
          labelAnchor: "20 -10",
          labelClass: "marker-labels"
        },
      });

      $timeout(function(){
        $scope.marker.coords = {
          latitude: 43.1451,
          longitude: -102.6680
        };
        $scope.dynamicMoveCtr++;
      },2000);
    },1000);
  }
  ]);
