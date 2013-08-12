angular.module('google-maps').controller('PolylineDisplayController',['$scope',function($scope){
    $scope.toggleStrokeColor = function(){
        $scope.stroke.color = ($scope.stroke.color == "#6060FB") ? "red" : "#6060FB";
    }
}]);