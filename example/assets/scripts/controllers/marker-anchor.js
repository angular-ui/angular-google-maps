// Code goes here

angular.module('app', ['uiGmapgoogle-maps'])
    .controller('mainCtrl', ['$scope', function($scope) {
        $scope.number = 0;
        $scope.map = {
            center: {
                latitude: 35.027469,
                longitude: -111.022753
            },
            zoom: 4,
            marker: {
                id:0,
                coords: {
                    latitude: 35.027469,
                    longitude: -111.022753
                },
                options: {
                    icon: {
                        anchor: new google.maps.Point(36,36),
                        origin: new google.maps.Point(0,0),
                        scaledSize: new google.maps.Size(72,72),
                        url: 'assets/images/cluster1.png'
                    }
                }
            }
        };
        $scope.click = function() {
            $scope.number += 1;
        }
    }]);