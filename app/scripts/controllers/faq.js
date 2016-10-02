'use strict';

angular.module('angularGoogleMapsApp')
  .controller('FAQCtrl', [ '$scope', '$anchorScroll', '$location', function ($scope, $anchorScroll, $location) {
    $scope.gotoAnchor = function(anchor) {
      $location.hash(anchor);
      $anchorScroll();
    };
  }]);
