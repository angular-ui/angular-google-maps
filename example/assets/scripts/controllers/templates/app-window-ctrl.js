angular.module('app')
.controller('WinController', function ($scope, $log) {

    $scope.getParam = function(){
      return $scope.parameter;
    };

    $scope.streetViewEvents = {
      image_status_changed:function(gObject,eventName,model,status){
        $log.info("status street: " + status);
      }
    };
});
