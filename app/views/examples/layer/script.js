'use strict';
angular.module('appMaps', ['uiGmapgoogle-maps'])
    .controller('mainCtrl', function($scope) {
        $scope.map = {center: {latitude: 38.90, longitude: -77.016 }, zoom: 12 };
        $scope.show = true;
    });
