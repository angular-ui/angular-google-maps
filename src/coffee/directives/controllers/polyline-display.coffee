angular.module("google-maps".ns())
.controller "PolylineDisplayController".ns(), ["$scope", ($scope) ->
    $scope.toggleStrokeColor = ->
        $scope.stroke.color = (if ($scope.stroke.color is "#6060FB") then "red" else "#6060FB")
]