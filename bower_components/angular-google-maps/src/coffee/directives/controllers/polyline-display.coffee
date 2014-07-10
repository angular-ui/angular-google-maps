angular.module("google-maps")
.controller "PolylineDisplayController", ["$scope", ($scope) ->
    $scope.toggleStrokeColor = ->
        $scope.stroke.color = (if ($scope.stroke.color is "#6060FB") then "red" else "#6060FB")
]