angular.module("search-box-example", ['uiGmapgoogle-maps'])

.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
  GoogleMapApi.configure({
//    key: 'your api key',
    v: '3.17',
    libraries: 'places'
  });
}])

.run(['$templateCache', function ($templateCache) {
  $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="pac-controls" type="text" placeholder="Search">');
  $templateCache.put('window.tpl.html', '<div ng-controller="WindowCtrl" ng-init="showPlaceDetails(parameter)">{{place.name}}</div>');
}])

.controller('WindowCtrl', function ($scope) {
  $scope.place = {};
  $scope.showPlaceDetails = function(param) {
    $scope.place = param;
  }
})

.controller("SearchBoxController",['$scope', '$timeout', 'uiGmapLogger', '$http','uiGmapGoogleMapApi'
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
                   
        },
        dragend: function(map) {
          //update the search box bounds after dragging the map
          var bounds = map.getBounds();
          var ne = bounds.getNorthEast();
          var sw = bounds.getSouthWest(); 
          $scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
          //$scope.searchbox.options.visible = true;
        }
      }
    },
    searchbox: {
      template:'searchbox.tpl.html',
      options: {
        autocomplete:true,
        types: ['(cities)'],
        componentRestrictions: {country: 'fr'}
      },
      events: {
        place_changed: function (autocomplete){
            
          place = autocomplete.getPlace()

          if (place.address_components) {
            
            newMarkers = [];
            var bounds = new google.maps.LatLngBounds();

            var marker = {
              id:place.place_id,
              place_id: place.place_id,
              name: place.address_components[0].long_name,
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
                $scope.selected.options.visible = false;
                marker.options.visble = false;
                return $scope.$apply();
              };
              marker.onClicked = function() {
                $scope.selected.options.visible = false;
                $scope.selected = marker;
                $scope.selected.options.visible = true;
              };
            });

            $scope.map.markers = newMarkers;
          } else {
            console.log("do something else with the search string: " + place.name);
          }
        }
      }


    }
  });




}]);
