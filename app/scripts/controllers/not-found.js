'use strict';

angular.module('angularGoogleMapsApp')
  .controller('NotFoundCtrl', function ($scope, $log, $location, $route) {
	$scope.requestedUrl = $location.search().url;
  });
