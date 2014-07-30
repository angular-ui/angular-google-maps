angular.module('appMaps', ['google-maps'])
    .run(function ($templateCache) {
        $templateCache.put('control.tpl.html', '<button class="btn btn-sm btn-primary" ng-class="{\'btn-warning\': danger}" ng-click="controlClick()">{{controlText}}</button>');
    })
    .controller('mainCtrl', function ($scope, $log) {
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 };
        $scope.options = {scrollwheel: false};
    })
    .controller('controlCtrl', function ($scope) {
        $scope.controlText = 'I\'m a custom control';
        $scope.danger = false;
        $scope.controlClick = function () {
            $scope.danger = !$scope.danger;
            alert('custom control clicked!');
        };
    });