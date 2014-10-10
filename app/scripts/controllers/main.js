'use strict';

angular.module('angularGoogleMapsApp')
  .controller('MainCtrl',['$scope', '$github', '$log', 'analytics', function ($scope, $github, $log, analytics) {

    var DOWNLOAD_URL_TEMPLATE = 'https://rawgit.com/angular-ui/angular-google-maps/%REF%/dist/angular-google-maps.min.js',
      FALLBACK_BRANCH = 'master';

    $scope.map = {
      center: {
        latitude: 40.7081,  // NYC
        longitude: -74.0041 // NYC
      },
      zoom: 13,
      options: {
        disableDefaultUI: true,
        mapTypeControl: false,
        tilt: 45
      }
    };

    $scope.marker = {
      coords: {
        latitude: 40.47,
        longitude: -74.50
      }
    };

    $scope.dlClick = function () {
      analytics.trackEvent('click', 'download');
    };

    $github.getTags().then(function (data) {
      $scope.latestTag = {};
      if (data && data.length) {
        $scope.latestTag = _.filter(data, function (d) {
          return 0 >= d.name.indexOf('SNAPSHOT');
        })[0];
      }
      $scope.downloadUrl = DOWNLOAD_URL_TEMPLATE.replace('%REF%', $scope.latestTag.name);
    }, function (e) {

      $log.error('could not fetch latest tag; falling back to ' + FALLBACK_BRANCH, e);

      $scope.latestTag = { name: FALLBACK_BRANCH };
      $scope.downloadUrl = DOWNLOAD_URL_TEMPLATE.replace('%REF%', FALLBACK_BRANCH);
    });
  }]);
