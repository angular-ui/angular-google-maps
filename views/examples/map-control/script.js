angular.module('appMaps', ['uiGmapgoogle-maps'])
    .controller('mainCtrl', function ($scope, $log) {
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 };
        $scope.options = {scrollwheel: false};
    })
    .controller('controlCtrl', function ($scope) {
        $scope.controlText = 'I\'m a custom control';
        $scope.danger = false;
        $scope.controlClick = function () {
            $scope.danger = !$scope.danger;
            alert('custom control clicked!');
        };
    })
    .controller('inlineControlCtrl',function($scope){
      $scope.controlText = 'I\'m a custom control from inline template';
      $scope.danger = false;
      $scope.controlClick = function () {
          $scope.danger = !$scope.danger;
          alert('custom control from inline template clicked!');
      };

    });
