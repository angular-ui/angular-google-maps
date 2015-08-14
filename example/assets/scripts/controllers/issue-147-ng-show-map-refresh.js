/**
 * Created by Maamar Yacine MEDDAH on 14/08/2015.
 */
'use strict'
var app = angular.module('ngMap', ['uiGmapgoogle-maps']);
app.controller('gMapCtrl', ['$scope','uiGmapIsReady', function($scope, IsReady){
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    $scope.displayed = false;
    $scope.showMap = function(){
        $scope.displayed = true;
        IsReady.promise().then(function (maps) {
            google.maps.event.trigger(maps[0].map, 'resize');
        });
    }
}]);
