angular.module('appMaps', ['google-maps'])
    .controller('mainCtrl', function($scope) {
        $scope.map = {center: {latitude: 2, longitude: 2}, zoom: 6, bounds: {}};
        $scope.bounds =  {
            sw: {
                latitude: 0,
                longitude: 0
            },
            ne: {
                latitude: 4,
                longitude: 4
            }
        };
    });