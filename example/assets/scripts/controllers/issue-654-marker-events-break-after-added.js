var app = angular.module('app', ['google-maps'.ns()]);
app.controller('TrackingCtrl', ['$rootScope', '$scope', '$timeout', '$log', 'GoogleMapApi'.ns(),
  function ($rootScope, $scope, $timeout, $log, GoogleMapApi) {
    $scope.map = {
      center: {
        latitude: 53.406754,
        longitude: -2.158843
      },
      pan: true,
      zoom: 5,
      refresh: false,
      events: {},
      bounds: {}
    };
    //when the API is really ready and loaded play w/ the scope
    GoogleMapApi.then(function (map) {
      $scope.map.markers = [
        {
          id: 1,
          location: {
            latitude: 53.406754,
            longitude: -2.158843
          },
          options: {
            title: 'Marker1'
          },
          showWindow: false
        }
      ];
      $scope.map.markerEvents = {
        dblclick: function (gMarker, eventName, model, latLngArgs) {
          var id = model.idKey || model.id;
          alert("Marker double clicked! Model: " + id);
        }
      }
      $timeout(function () {
        $scope.map.markers[0].latitude = 53.416754;
        $scope.map.markers[0].longitude = -2.148843;

        _.range(10).forEach(function (i) {
          $scope.map.markers.push({
            id: i + 1,
            location: {
              latitude: $scope.map.markers[0].latitude + 1 * i,
              longitude: $scope.map.markers[0].longitude + 1 * i
            },
            options: {
              title: 'Marker2'
            },
            showWindow: false
          })
        });
      }, 1000);
    });
}])
.
config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
  GoogleMapApi.configure({
//    key: 'your api key',
    v: '3.16',
    libraries: 'weather,geometry,visualization'
  });
}])

;