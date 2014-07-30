angular.module('appMaps', ['google-maps'])
    .controller('mainCtrl', function($scope) {
        $scope.map = {center: {latitude: 44, longitude: -108 }, zoom: 4 };
        $scope.options = {scrollwheel: false};
        $scope.circles = [
            {
                id: 1,
                center: {
                    latitude: 44,
                    longitude: -108
                },
                radius: 500000,
                stroke: {
                    color: '#08B21F',
                    weight: 2,
                    opacity: 1
                },
                fill: {
                    color: '#08B21F',
                    opacity: 0.5
                },
                geodesic: true, // optional: defaults to false
                draggable: true, // optional: defaults to false
                clickable: true, // optional: defaults to true
                editable: true, // optional: defaults to false
                visible: true // optional: defaults to true
            }
        ];
    });