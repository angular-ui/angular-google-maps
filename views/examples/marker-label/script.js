angular.module('appMaps', ['uiGmapgoogle-maps'])
    .controller('mainCtrl', function($scope) {
        $scope.map = {center: {latitude: 40, longitude: -99 }, zoom: 12 }
        $scope.options = {scrollwheel: false};
        $scope.marker = {
            id:0,
            title: "Fancy Title!",
            coords: {
                latitude: 40,
                longitude: -99
            }
        }
    });