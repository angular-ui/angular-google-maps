
(function () {
    var module = angular.module("angular-google-maps-example", ["google-maps"]);
}());

function ExampleController ($scope, $timeout, $log) {

    // Enable the new Google Maps visuals until it gets enabled by default.
    // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    google.maps.visualRefresh = true;

    onMarkerClicked = function(marker){
        marker.showWindow = true;
        window.alert("Marker: lat: " + marker.latitude +", lon: " + marker.longitude + " clicked!!")
    };

    angular.extend($scope, {
        map: {
            showTraffic: true,
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 3,
            dragging: false,
            bounds: {},
            markers: [
                {
                    latitude: 45,
                    longitude: -74,
                    showWindow: false
                },
                {
                    latitude: 15,
                    longitude: 30,
                    showWindow: false
                },
                {
                    icon: 'plane.png',
                    latitude: 37,
                    longitude: -122,
                    showWindow: false
                }
            ],
            markers2: [
                {
                    latitude: 46,
                    longitude: -77,
                    showWindow: false
                },
                {
                    latitude: 33,
                    longitude: -77,
                    showWindow: false
                },
                {
                    icon: 'plane.png',
                    latitude: 35,
                    longitude: -125,
                    showWindow: false
                }
            ],
            dynamicMarkers: [],
            clickedMarker: {
                latitude: null,
                longitude: null
            },
            events: {
                click: function (mapModel, eventName, originalEventArgs) {
                    // 'this' is the directive's scope
                    $log.log("user defined event: " + eventName, mapModel, originalEventArgs);

                    var e = originalEventArgs[0];

                    if (!$scope.map.clickedMarker) {
                        $scope.map.clickedMarker = {
                            latitude: e.latLng.lat(),
                            longitude: e.latLng.lng()
                        };
                    }
                    else {
                        $scope.map.clickedMarker.latitude = e.latLng.lat();
                        $scope.map.clickedMarker.longitude = e.latLng.lng();
                    }

                    $scope.$apply();
                }
            },
            infoWindow: {
                coords: {
                    latitude: 30,
                    longitude: -89
                },
                show: false
            },
            templatedInfoWindow: {
                coords: {
                    latitude: 60,
                    longitude: -95
                },
                show: true,
                templateUrl: 'templates/info.html',
                templateParameter: {
                    message: 'passed in from the opener'
                }
            },
            polyline: {
                path: [
                    {
                        latitude: 45,
                        longitude: -74
                    },
                    {
                        latitude: 30,
                        longitude: -89
                    },
                    {
                        latitude: 37,
                        longitude: -122
                    },
                    {
                        latitude: 60,
                        longitude: -95
                    }
                ],
                stroke: {
                  color: '#6060FB',
                  weight: 3
                }
            }
        }
    });

    _.each($scope.map.markers,function(marker){
        marker.closeClick = function(){                        
            marker.showWindow = false;
            $scope.$apply();
        };
        marker.onClicked = function(){
            onMarkerClicked(marker);
        };
    });

    _.each($scope.map.markers2,function(marker){
        marker.closeClick = function(){                        
            marker.showWindow = false;
            $scope.$apply();
        };
        marker.onClicked = function(){
            onMarkerClicked(marker);
        };
    });

    $scope.removeMarkers = function () {
        $log.info("Clearing markers. They should disappear from the map now");
        $scope.map.markers.length = 0;
        $scope.map.markers2.length = 0;
        $scope.map.dynamicMarkers.length = 0;
        $scope.map.clickedMarker = null;
    };

    $scope.onMarkerClicked = onMarkerClicked

    $timeout(function () {
        $scope.map.infoWindow.show = true;
        dynamicMarkers = [
                {
                    latitude: 46,
                    longitude: -79,
                    showWindow: false
                },
                {
                    latitude: 33,
                    longitude: -79,
                    showWindow: false
                },
                {
                    icon: 'plane.png',
                    latitude: 35,
                    longitude: -127,
                    showWindow: false
                }
        ];
       _.each(dynamicMarkers,function(marker){
            marker.closeClick = function(){                        
                marker.showWindow = false;
                $scope.$apply();
            };
            marker.onClicked = function(){
                onMarkerClicked(marker);
            };
        });
        $scope.map.dynamicMarkers = dynamicMarkers;
    }, 2000);
}
