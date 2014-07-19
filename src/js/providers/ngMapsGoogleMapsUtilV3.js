angular.module('google-maps.providers')
    .provider('ngMapsGoogleMapsUtilV3', ['googleMaps', function (googleMaps) {
      googleMaps.then(function (googleMaps) {
        @@REPLACE_W_LIBS
      })
    }]);