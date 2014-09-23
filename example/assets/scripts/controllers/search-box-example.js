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
    console.log("showPlaceDetails" + param.name);
    $scope.place = param;
  }
  $scope.onClick = function () {
    alert('window button clicked');
  };
})
.controller("SearchBoxController",['$scope', '$timeout', 'Logger'.ns(), '$http','GoogleMapApi'.ns()
    , function ($scope, $timeout, $log, $http, GoogleMapApi) {
  $log.doLog = true

  GoogleMapApi.then(function(maps) {
    maps.visualRefresh = true;

    $scope.map.bounds = new maps.LatLngBounds(
      new maps.LatLng(55,-100),
      new maps.LatLng(49,-78)
    );
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
      idkey: 'place_id'
    },
    searchbox: {
      template:'searchbox.tpl.html',
      position:'top-left',
      //parentdiv:'searchBoxParent',
      events: {
        places_changed: function (searchBox) {
          currentBounds = new google.maps.LatLngBounds(new google.maps.LatLng($scope.map.bounds.northeast.latitude, $scope.map.bounds.northeast.longitude), new google.maps.LatLng($scope.map.bounds.southwest.latitude, $scope.map.bounds.southwest.longitude));
          searchBox.setBounds(currentBounds)
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
              console.log("CloseClicked", marker);
              $scope.selected.options.visible = false
              marker.options.visble = false;
              return $scope.$apply();
            };
            marker.onClicked = function() {
              console.log("Clicked!", marker.options.visible);
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