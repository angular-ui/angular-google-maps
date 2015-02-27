(function () {
  angular.module('appMaps', ['uiGmapgoogle-maps'])
  .config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      v: '3.18'
    });
  })
  .controller('MapCtrl', ['$scope', 'uiGmapGoogleMapApi',
    '$interval', '$timeout', 'uiGmapGmapUtil',
    function ($scope, uiGmapGoogleMapApi, $interval, $timeout, uiGmapGmapUtil) {
      this.map = {};
      var self = this;
      uiGmapGoogleMapApi.then(function (maps) {
        angular.extend(self.map, {
          center: {
            latitude: 42.194576,
            longitude: -122.709477
          },
          zoom: 13,
          control: {}
        });

        $timeout(function () {
          var map = self.map.control.getGMap();
          var maps = google.maps;

          map.fitBounds(new maps.LatLngBounds(
          new maps.LatLng(43.194576,
          -123.709477
          ), new maps.LatLng(42.194576,
          -122.709477
          )));
        }, 2000);
      });
    }])
})();