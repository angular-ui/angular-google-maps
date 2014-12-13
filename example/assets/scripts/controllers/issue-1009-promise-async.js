// Code goes here

angular.module('app', [
  "uiGmapgoogle-maps"
])
.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
  GoogleMapApi.configure({
//    key: 'your api key',
    v: '3.16',
    libraries: ''
  });
}]).
controller("controller", ["$scope", function($scope) {
    var lastId = 1;

    $scope.searchResults = {
      results: []
    };
    
    $scope.map = {
      control: {},
      center: {
        latitude: 40.74349,
        longitude: -73.990822
      },
      zoom: 12,
      dragging: false,
      bounds: {},
      markers: [],
      events: {
        idle: function (map) {
                   
        },
        dragend: function(map) {
          var bounds = map.getBounds();
          var ne = bounds.getNorthEast();
          var sw = bounds.getSouthWest(); 
        }
      }
    };
  
    
    
    $scope.addMarkers = function(num) {
      markers = []
      for (i = 0; i < num; i++) {
        coords = chance.coordinates().split(',');
        if(markers.length < 100){
          markers.push({
            'coords': {
              'latitude': coords[0],
              'longitude': coords[1]
            },
            'key': 'someKey-'+lastId
          });
          lastId++;
        }
      }
      
      $scope.searchResults = {
        results: markers
      };
    }
    
    $scope.reset = function() {
      lastId = 1;
      $scope.searchResults = {
        results: []
      };
    };

  }
]);