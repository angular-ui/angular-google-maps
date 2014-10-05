angular.module('appMaps', ['google-maps'.ns()])
  .controller('mainCtrl', function ($scope) {
    $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, bounds: {}};
    $scope.options = {scrollwheel: false};
    $scope.showPinkMarkers = true;

    var createRandomMarker = function (i, bounds, idKey, icon) {
      var lat_min = bounds.southwest.latitude,
        lat_range = bounds.northeast.latitude - lat_min,
        lng_min = bounds.southwest.longitude,
        lng_range = bounds.northeast.longitude - lng_min;

      if (idKey === null) {
        idKey = "id";
      }

      var latitude = lat_min + (Math.random() * lat_range);
      var longitude = lng_min + (Math.random() * lng_range);
      var ret = {
        latitude: latitude,
        longitude: longitude,
        title: 'm' + i
      };
      if (icon !== null) {
        ret.icon = icon;
      }
      ret[idKey] = i;
      ret.show= true;
      return ret;
    };
    $scope.randomMarkers = [];
    $scope.pinkRandomMarkers = [];
    // Get the bounds from the map once it's loaded
    $scope.$watch(function () {
      return $scope.map.bounds;
    }, function (nv, ov) {
      if (!ov.southwest && nv.southwest) {
        var markers = [];
        var pinkRandomMarkers = [];
        for (var i = 0; i < 250; i++) {
          markers.push(createRandomMarker(i, $scope.map.bounds, null, 'http://www.ozmorris.com/images/owl5.png'));
          pinkRandomMarkers.push(createRandomMarker(i + 100, $scope.map.bounds, null, 'http://www.ozmorris.com/images/owl16.png'));
        }
        $scope.randomMarkers = markers;
        $scope.pinkRandomMarkers = pinkRandomMarkers;
      }
    }, true);
  });