angular.module('appMaps', ['uiGmapgoogle-maps'])
    .config(function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
          //    key: 'your api key',
          v: '3.20', //defaults to latest 3.X anyhow
          libraries: 'places' // Required for SearchBox.
      });
    })
    .controller('mainCtrl', function ($scope, $log) {
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 };
        $scope.options = {scrollwheel: false};
        var events = {
          places_changed: function (searchBox) {}
        }
        $scope.searchbox = { template:'searchbox.tpl.html', events:events};
    });
