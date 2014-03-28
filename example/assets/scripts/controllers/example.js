angular.module("angular-google-maps-example", ["google-maps"]).value("rndAddToLatLon",
        function () {
    return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1)
}).controller("controller", function ($scope, $timeout, $log, $http, rndAddToLatLon) {
    // Enable the new Google Maps visuals until it gets enabled by default.
    // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    google.maps.visualRefresh = true;

    var versionUrl = window.location.host === "rawgithub.com" ? "http://rawgithub.com/nlaplante/angular-google-maps/master/package.json" : "/package.json";

    $http.get(versionUrl).success(function (data) {
        if (!data)
            console.error("no version object found!!");
        $scope.version = data.version;
    });

    var onMarkerClicked = function (marker) {
        marker.showWindow = true;
        //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
    };

    var genRandomMarkers = function (numberOfMarkers, scope) {
        var markers = [];
        for (var i = 0; i < numberOfMarkers; i++) {
            markers.push(createRandomMarker(i, scope.map.bounds))
        }
        scope.map.randomMarkers = markers;
    };

    var createRandomMarker = function (i, bounds) {
        var lat_min = bounds.southwest.latitude,
                lat_range = bounds.northeast.latitude - lat_min,
                lng_min = bounds.southwest.longitude,
                lng_range = bounds.northeast.longitude - lng_min;

        var latitude = lat_min + (Math.random() * lat_range);
        var longitude = lng_min + (Math.random() * lng_range);
        return {
            latitude: latitude,
            longitude: longitude,
            title: 'm' + i
        };
    };

    angular.extend($scope, {
        map: {
            control: {},
            version: "uknown",
            heatLayerCallback: function (layer) {
                //set the heat layers backend data
                var mockHeatLayer = new MockHeatLayer(layer);
            },
            showTraffic: true,
            showBicycling: false,
            showWeather: false,
            showHeat: false,
            center: {
                latitude: 45,
                longitude: -73
            },
            options: {
                streetViewControl: false,
                panControl: false,
                maxZoom: 20,
                minZoom: 3
            },
            zoom: 3,
            dragging: false,
            bounds: {},
            markers: [
                {
                    latitude: 45,
                    longitude: -74,
                    showWindow: false,
                    title: 'Marker 2'
                },
                {
                    latitude: 15,
                    longitude: 30,
                    showWindow: false,
                    title: 'Marker 2'
                },
                {
                    icon: 'assets/images/plane.png',
                    latitude: 37,
                    longitude: -122,
                    showWindow: false,
                    title: 'Plane'
                }
            ],
            markers2: [
                {
                    latitude: 46,
                    longitude: -77,
                    showWindow: false,
                    title: '[46,-77]'
                },
                {
                    latitude: 33,
                    longitude: -77,
                    showWindow: false,
                    title: '[33,-77]'
                },
                {
                    icon: 'assets/images/plane.png',
                    latitude: 35,
                    longitude: -125,
                    showWindow: false,
                    title: '[35,-125]'
                }
            ],
            mexiMarkers: [
                {
                    latitude: 29.302567,
                    longitude: -106.248779
                },
                {
                    latitude: 30.369913,
                    longitude: -109.434814
                },
                {
                    latitude: 26.739478,
                    longitude: -108.61084
                }
            ],
            dynamicMarkers: [],
            randomMarkers: [],
	    clickMarkers: [
		{"latitude": 50.948968, "longitude": 6.944781}
		,{"latitude": 50.94129, "longitude": 6.95817}
		,{"latitude": 50.9175, "longitude": 6.943611}
	    ],
            doClusterRandomMarkers: true,
            doUgly: true, //great name :)
            clusterOptions: {title: 'Hi I am a Cluster!', gridSize: 60, ignoreHidden: true, minimumClusterSize: 2,
                imageExtension: 'png', imagePath: 'assets/images/cluster', imageSizes: [72]},
            clickedMarker: {
                title: 'You clicked here',
                latitude: null,
                longitude: null
            },
            events: {
                tilesloaded: function (map, eventName, originalEventArgs) {
                },
                click: function (mapModel, eventName, originalEventArgs) {
                    // 'this' is the directive's scope
                    $log.log("user defined event: " + eventName, mapModel, originalEventArgs);

                    var e = originalEventArgs[0];

                    if (!$scope.map.clickedMarker) {
                        $scope.map.clickedMarker = {
                            title: 'You clicked here',
                            latitude: e.latLng.lat(),
                            longitude: e.latLng.lng()
                        };
                    }
                    else {
                        $scope.map.clickedMarker.latitude = e.latLng.lat();
                        $scope.map.clickedMarker.longitude = e.latLng.lng();
                    }

                    $scope.$apply();
                },
                dragend: function () {
                    self = this;
                    $timeout(function () {
                        modified = _.map($scope.map.mexiMarkers, function (marker) {
                            return {
                                latitude: marker.latitude + rndAddToLatLon(),
                                longitude: marker.longitude + rndAddToLatLon()
                            }
                        })
                        $scope.map.mexiMarkers = modified;
                    });
                }
            },
            infoWindow: {
                coords: {
                    latitude: 36.270850,
                    longitude: -44.296875
                },
                options: {
                    disableAutoPan: true
                },
                show: false
            },
            infoWindowWithCustomClass: {
                coords: {
                    latitude: 36.270850,
                    longitude: -44.296875
                },
                options: {
                    boxClass: 'custom-info-window'
                },
                show: true
            },
            templatedInfoWindow: {
                coords: {
                    latitude: 48.654686,
                    longitude: -75.937500
                },
                options: {
                    disableAutoPan: true
                },
                show: true,
                templateUrl: 'assets/templates/info.html',
                templateParameter: {
                    message: 'passed in from the opener'
                }
            },
            polylines: [
                {
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
                    },
                    editable: true,
                    draggable: false,
                    geodesic: false,
                    visible: true
                },
                {
                    path: [
                        {
                            latitude: 47,
                            longitude: -74
                        },
                        {
                            latitude: 32,
                            longitude: -89
                        },
                        {
                            latitude: 39,
                            longitude: -122
                        },
                        {
                            latitude: 62,
                            longitude: -95
                        }
                    ],
                    stroke: {
                        color: '#6060FB',
                        weight: 3
                    },
                    editable: true,
                    draggable: true,
                    geodesic: true,
                    visible: true
                }
            ]
        },
        toggleColor: function (color) {
            return color == 'red' ? '#6060FB' : 'red';
        }

    });

    _.each($scope.map.markers, function (marker) {
        marker.closeClick = function () {
            marker.showWindow = false;
            $scope.$apply();
        };
        marker.onClicked = function () {
            onMarkerClicked(marker);
        };
    });

    _.each($scope.map.markers2, function (marker) {
        marker.closeClick = function () {
            marker.showWindow = false;
            $scope.$apply();
        };
        marker.onClicked = function () {
            onMarkerClicked(marker);
        };
    });

    $scope.removeMarkers = function () {
        $log.info("Clearing markers. They should disappear from the map now");
        $scope.map.markers.length = 0;
        $scope.map.markers2.length = 0;
        $scope.map.dynamicMarkers.length = 0;
        $scope.map.randomMarkers.length = 0;
        $scope.map.mexiMarkers.length = 0;
        $scope.map.polylines.length = 0;
        $scope.map.clickedMarker = null;
        $scope.searchLocationMarker = null;
        $scope.map.infoWindow.show = false;
        $scope.map.templatedInfoWindow.show = false;
        // $scope.map.infoWindow.coords = null;
    };
    $scope.refreshMap = function () {
        //optional param if you want to refresh you can pass null undefined or false or empty arg
        $scope.map.control.refresh({latitude: 32.779680, longitude: -79.935493});
        $scope.map.control.getGMap().setZoom(11);
        return;
    };
    $scope.getMapInstance = function () {
        alert("You have Map Instance of" + $scope.map.control.getGMap().toString());
        return;
    }
    $scope.map.clusterOptionsText = JSON.stringify($scope.map.clusterOptions);
    $scope.$watch('map.clusterOptionsText', function (newValue, oldValue) {
        if (newValue !== oldValue)
            $scope.map.clusterOptions = angular.fromJson($scope.map.clusterOptionsText);
    });

    $scope.$watch('map.doUgly', function (newValue, oldValue) {
        var json;
        if (newValue !== oldValue) {
            if (newValue)
                json = {title: 'Hi I am a Cluster!', gridSize: 60, ignoreHidden: true, minimumClusterSize: 2,
                    imageExtension: 'png', imagePath: 'http://localhost:3000/example/cluster', imageSizes: [72]};
            else
                json = {title: 'Hi I am a Cluster!', gridSize: 60, ignoreHidden: true, minimumClusterSize: 2};
            $scope.map.clusterOptions = json;
            $scope.map.clusterOptionsText = angular.toJson(json);
        }
    });

    $scope.genRandomMarkers = function (numberOfMarkers) {
        genRandomMarkers(numberOfMarkers, $scope);
    };

    $scope.searchLocationMarker = {
        coords: {
            latitude: 40.1451,
            longitude: -99.6680
        },
        options: { draggable: true },
        events: {
            dragend: function (marker, eventName, args) {
                $log.log('marker dragend');
                $log.log(marker.getPosition().lat());
                $log.log(marker.getPosition().lng());
            }
        }
    }
    $scope.onMarkerClicked = onMarkerClicked;

    $scope.clackMarker = function($markerModel) {
      $log.log("from clackMarker");
	    $log.log($markerModel);
    };

    $timeout(function () {
        $scope.map.polylines[0].path.push({
              latitude: 61,
              longitude: -105
          });
          $scope.map.polylines[0].path.push({
              latitude: 70,
              longitude: -105
        });
        $scope.map.infoWindow.show = true;
        var dynamicMarkers = [
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
                icon: 'assets/images/plane.png',
                latitude: 35,
                longitude: -127,
                showWindow: false
            }
        ];
        _.each(dynamicMarkers, function (marker) {
            marker.closeClick = function () {
                marker.showWindow = false;
                $scope.$apply();
            };
            marker.onClicked = function () {
                onMarkerClicked(marker);
            };
        });
        $scope.map.dynamicMarkers = dynamicMarkers;
    }, 2000);
});
