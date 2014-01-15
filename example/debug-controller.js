(function () {
    var module = angular.module("angular-google-maps-example", ["google-maps"]);
}());

var rndAddToLatLon = function () {
    return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1)
}

function DebugController($scope, $timeout, $log, $http) {
    // Enable the new Google Maps visuals until it gets enabled by default.
    // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    google.maps.visualRefresh = true;

    versionUrl = window.location.host === "rawgithub.com" ? "http://rawgithub.com/nlaplante/angular-google-maps/master/package.json" : "/package.json";

    $http.get(versionUrl).success(function (data) {
        if (!data)
            console.error("no version object found!!");
        $scope.version = data.version;
    });


    angular.extend($scope, {
        map:{
            center: {
                latitude: 45,
                longitude: -74
            },
            marker: {
                latitude: 45,
                longitude: -74,
                options:{
                    visible:false
                }
            },
            marker2: {
                latitude: 45.2,
                longitude: -74.5
            },
//            dragging:false, //appears to be required
            zoom: 7,
            options: {
                disableDefaultUI: true,
                panControl: false,
                navigationControl: false,
                scrollwheel: false,
                scaleControl: false
            }
        }
    });

}
