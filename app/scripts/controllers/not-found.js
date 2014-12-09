'use strict';

angular.module('angularGoogleMapsApp')
  .controller(['$scope', '$log', '$location', 'NotFoundCtrl', function ($scope, $log, $location) {
    $scope.requestedUrl = $location.search().url;
  }]);
