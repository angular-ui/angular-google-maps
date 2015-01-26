angular.module('app')
.controller('WinController', function ($scope, $log) {

    $scope.getParam = function(){
      return $scope.parameter;
    };
});
