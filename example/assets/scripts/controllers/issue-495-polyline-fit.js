angular.module("angular-google-maps-example", ['uiGmapgoogle-maps']).value("rndAddToLatLon",function () {
  return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1);
}).controller("controller", ['$rootScope', '$scope', '$location', '$http', function ($rootScope, $scope, $location, $http) {
    $scope.map = {
        // http://angular-google-maps.org/use
        center: {
            latitude: 17.38504400000000,
            longitude: 78.48667100000000
        },
        zoom: 9,
        lineStyle: {
            color: '#333',
            weight: 5,
            opacity: 0.7
        }
    };
    $scope.locations = [
        {
            "createdAt": {
                "date": "2014-06-13 15:00:33",
                "timezone_type": 3,
                "timezone": "Asia\/Kolkata"
            },
            "source": "121",
            "source_type": "entry_created",
            "latitude": 17.485044,
            "longitude": 79.386671,
            "location": "Unknown",
            "title": "1) Created entry on: One AAA at 2014-06-13 15:00:33 (Unknown)"
        },
        {
            "createdAt": {
                "date": "2014-06-14 08:21:05",
                "timezone_type": 3,
                "timezone": "Asia\/Kolkata"
            },
            "source": null,
            "source_type": "login",
            "latitude": 17.685044,
            "longitude": 78.586671,
            "location": "Unknown",
            "title": "2) Login at 2014-06-14 08:21:05 (Unknown)"
        },
        {
            "createdAt": {
                "date": "2014-06-14 08:30:30",
                "timezone_type": 3,
                "timezone": "Asia\/Kolkata"
            },
            "source": null,
            "source_type": "logout",
            "latitude": 18.385044,
            "longitude": 78.986671,
            "location": "Unknown",
            "title": "3) Logout at 2014-06-14 08:30:30 (Unknown)"
        },
        {
            "createdAt": {
                "date": "2014-06-15 00:16:36",
                "timezone_type": 3,
                "timezone": "Asia\/Kolkata"
            },
            "source": null,
            "source_type": "login",
            "latitude": 17.885044,
            "longitude": 78.986671,
            "location": "Unknown",
            "title": "4) Login at 2014-06-15 00:16:36 (Unknown)"
        }
    ];
}]);