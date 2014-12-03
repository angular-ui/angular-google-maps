angular.module('app', ['uiGmapgoogle-maps'])
.controller('mainCtrl', function($scope, uiGmapIsReady) {
  $scope.map = {
    center: {
      latitude: 40.1451,
      longitude: -99.6680
    },
    zoom: 4,
    bounds: {}
  };
  $scope.options = {
    scrollwheel: false
  };
  var createRandomMarker = function(i, bounds, idKey) {
    var lat_min = bounds.southwest.latitude,
    lat_range = bounds.northeast.latitude - lat_min,
    lng_min = bounds.southwest.longitude,
    lng_range = bounds.northeast.longitude - lng_min;

    if (idKey == null) {
      idKey = "id";
    }

    var latitude = lat_min + (Math.random() * lat_range);
    var longitude = lng_min + (Math.random() * lng_range);
    var ret = {
      latitude: latitude,
      longitude: longitude,
      title: 'm' + i
    };
    ret[idKey] = i;
    return ret;
  };
  $scope.randomMarkers = [];
  // Get the bounds from the map once it's loaded


  var createMarkersFromBounds = function(){
    var markers = [];
    for (var i = 0; i < 50; i++) {
      markers.push(createRandomMarker(i, $scope.map.bounds))
    }
    _.defer(function(){
      $scope.randomMarkers = markers;
    });
  };

  $scope.$watch(function() {
    return $scope.map.bounds;
  }, function(nv, ov) {
    // Only need to regenerate once
    if (!ov.southwest && nv.southwest) {
      createMarkersFromBounds();
    }
  }, true);
  $scope.clear = function() {
    $scope.randomMarkers = [];
  };
  $scope.move = function() {
    console.log('moving');
    if ($scope.randomMarkers.length == 0) {
      return createMarkersFromBounds();
    }
    var marker = $scope.randomMarkers[0];
    var newPosition = createRandomMarker(0, $scope.map.bounds)
    marker.latitude = newPosition.latitude;
    marker.longitude = newPosition.longitude;
  }
});
