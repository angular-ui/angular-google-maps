angular.module('appMaps', ['google-maps'])
    .controller('mainCtrl', function($scope) {
        $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 4 };
        $scope.options = {scrollwheel: false};
        $scope.showWeather = true;
    });