angular.module('appMaps', ['google-maps'])
    .controller('mainCtrl', function($scope) {
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, bounds: {}};
        $scope.polygons = [
            {
                id: 1,
                path: [
                    {
                        latitude: 50,
                        longitude: -80
                    },
                    {
                        latitude: 30,
                        longitude: -120
                    },
                    {
                        latitude: 20,
                        longitude: -95
                    }
                ],
                stroke: {
                    color: '#6060FB',
                    weight: 3
                },
                editable: true,
                draggable: true,
                geodesic: false,
                visible: true,
                fill: {
                    color: '#ff0000',
                    opacity: 0.8
                }
            }
        ];
    });