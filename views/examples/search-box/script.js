angular.module('appMaps', ['google-maps'.ns()])
    .controller('mainCtrl', function ($scope, $log) {
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 };
        $scope.options = {scrollwheel: false};
        $scope.searchbox = { template:'searchbox.tpl.html', position:'top-left'};
    });