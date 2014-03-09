function Example2Controller($scope, $timeout, $log, $http, Logger) {
    new ExampleController($scope, $timeout, $log, $http, Logger);
    var lastPolyline =  {
        id:1,
        path: [
            {
                latitude: 45,
                longitude: -74
            },
            {
                latitude: 30,
                longitude: -89
            },
            {
                latitude: 37,
                longitude: -122
            },
            {
                latitude: 60,
                longitude: -95
            }
        ],
        stroke: {
            color: '#6060FB',
            weight: 3
        },
        editable: true,
        draggable: true,
        geodesic: true,
        visible: true
    };
     _async.map(_.range(125), function(i){
        var newPath = _.map(lastPolyline.path,function(p){
            return {
                latitude  :p.latitude,
                longitude :p.longitude + 1
            };
        });
        var newPoly = _.clone(lastPolyline);
        newPoly.id = i +1;
        newPoly.path = newPath;
        lastPolyline = newPoly;
        return newPoly;
    },function(mapped){
         $scope.map.polylines = mapped;
     });
}