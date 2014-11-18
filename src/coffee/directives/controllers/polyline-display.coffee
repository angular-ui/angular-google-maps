angular.module('uiGmapgoogle-maps')
.controller 'uiGmapPolylineDisplayController', ['$scope', ($scope) ->
    $scope.toggleStrokeColor = ->
        $scope.stroke.color = (if ($scope.stroke.color is '#6060FB') then 'red' else '#6060FB')
]
