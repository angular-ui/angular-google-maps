angular.module("search-box-example", ["google-maps".ns()])

.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
  GoogleMapApi.configure({
//    key: 'your api key',
    v: '3.16',
    libraries: 'places'
  });
}])

.run(['$templateCache', function ($templateCache) {
  $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="pac-controls" type="text" placeholder="Search Box">');
  $templateCache.put('window.tpl.html', '<div ng-controller="WindowCtrl" ng-init="showPlaceDetails(parameter)">{{place.name}}</div>');
}])

.controller('WindowCtrl', function ($scope) {
  $scope.place = {};
  $scope.showPlaceDetails = function(param) {
    $scope.place = param;
  }
})

.controller("SearchBoxController",['$scope', '$timeout', 'Logger'.ns(), '$http','GoogleMapApi'.ns()
    , function ($scope, $timeout, $log, $http, GoogleMapApi) {
  $log.doLog = true

  
  

  GoogleMapApi.then(function(maps) {
    maps.visualRefresh = true;
    $scope.defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(40.82148, -73.66450),
      new google.maps.LatLng(40.66541, -74.31715));

    
    $scope.map.bounds = {
      northeast: {
        latitude:$scope.defaultBounds.getNorthEast().lat(),
        longitude:$scope.defaultBounds.getNorthEast().lng()
      },
      southwest: {
        latitude:$scope.defaultBounds.getSouthWest().lat(),
        longitude:-$scope.defaultBounds.getSouthWest().lng()

      }
    }
    $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
  });

  angular.extend($scope, {
    selected: {
      options: {
        visible:false
        
      },
      templateurl:'window.tpl.html',
      templateparameter: {}
    },
    map: {
      control: {},
      center: {
        latitude: 40.74349,
        longitude: -73.990822
      },
      zoom: 12,
      dragging: false,
      bounds: {},
      markers: [],
      idkey: 'place_id',
      events: {
        idle: function (map) {
          var bounds = map.getBounds();
          var ne = bounds.getNorthEast(); // LatLng of the north-east corner
          //console.log("ne bounds " + ne.lat() + ", " + ne.lng());
          var sw = bounds.getSouthWest(); // LatLng of the south-west corder
          //console.log("sw bounds " + sw.lat() + ", " + sw.lng());
        }
      }
    },
    searchbox: {
      template:'searchbox.tpl.html',
      position:'top-left',
      options: {
        bounds: {} 
      },
      //parentdiv:'searchBoxParent',
      events: {
        places_changed: function (searchBox) {
          places = searchBox.getPlaces()
          if (places.length == 0) {
            return;
          }
          // For each place, get the icon, place name, and location.
          newMarkers = [];
          var bounds = new google.maps.LatLngBounds();
          for (var i = 0, place; place = places[i]; i++) {
            // Create a marker for each place.
            var marker = {
              id:i,
              place_id: place.place_id,
              name: place.name,
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              options: {
                visible:false
              },
              templateurl:'window.tpl.html',
              templateparameter: place
            };
            newMarkers.push(marker);
            
            bounds.extend(place.geometry.location);
          }

          $scope.map.bounds = {
            northeast: {
              latitude: bounds.getNorthEast().lat(),
              longitude: bounds.getNorthEast().lng()
            },
            southwest: {
              latitude: bounds.getSouthWest().lat(),
              longitude: bounds.getSouthWest().lng()
            }
          }

          _.each(newMarkers, function(marker) {
            marker.closeClick = function() {
              $scope.selected.options.visible = false
              marker.options.visble = false;
              return $scope.$apply();
            };
            marker.onClicked = function() {
              $scope.selected.options.visible = false;
              $scope.selected = marker;
              $scope.selected.options.visible = true
            };
          });

          $scope.map.markers = newMarkers
        }
      }

      
    }
  });


  

}]);