angular.module('app', ['google-maps'.ns()])
  .controller('ctrl', ['$scope', function ($scope) {
    $scope.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 3,
      events: {
        tilesloaded: function (map, eventName, originalEventArgs) {
          //map is trueley ready then this callback is hit
        },
        click: function (mapModel, eventName, originalEventArgs) {
          var e = originalEventArgs[0];
          var lat = e.latLng.lat(),
            lon = e.latLng.lng();
          $scope.map.clickedMarker = {
            id: 0,
            title: 'You clicked here ' + 'lat: ' + lat + ' lon: ' + lon,
            latitude: lat,
            longitude: lon
          };
          //scope apply required because this event handler is outside of the angular domain
          $scope.$apply();
        }
      },
      markers: [
        {
          id: 1,
          latitude: 45,
          longitude: -74,
          showWindow: false,
          title: 'Markers: 1'
        },
        {
          id: 2,
          latitude: 15,
          longitude: 30,
          showWindow: false,
          title: 'Markers: 2'
        },
        {
          id: 3,
          icon: 'assets/images/plane.png',
          latitude: 37,
          longitude: -122,
          showWindow: false,
          title: 'Markers: 3'
        }
      ],
      markers2: [
        {
          id: 1,
          latitude: 49,
          longitude: -74,
          showWindow: false,
          title: 'Markers: 1'
        },
        {
          id: 2,
          latitude: 19,
          longitude: 30,
          showWindow: false,
          title: 'Markers: 2'
        },
        {
          id: 3,
          icon: 'assets/images/plane.png',
          latitude: 41,
          longitude: -122,
          showWindow: false,
          title: 'Markers: 3'
        }
      ],
      clickedMarker: {
        id: 0,
        title: ''
      },
      marker: {
        events: {
          click: function (marker) {
            marker.showWindow = true;
            $scope.$apply();
            //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
          },
          dblclick: function (marker) {
            alert("Double Clicked!");
          }
        }
      }
    };
  }]);