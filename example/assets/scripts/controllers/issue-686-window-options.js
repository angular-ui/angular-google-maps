angular.module('appMaps', ['google-maps'.ns()])
    .controller('mainCtrl', function($scope) {
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, bounds: {}};
        $scope.options = {scrollwheel: false};
        $scope.onClick = function() {
            console.log("Clicking");
            $scope.windowoptions.visible = !$scope.windowoptions.visible;
        };

        $scope.closeClick = function() {
            $scope.windowoptions.visible = false;
        };

        $scope.marker = {
            id: 0,
            latitude: 40.1451,
            longitude: -99.6680,
            events: {
                'click': $scope.onClick
            }
        };
        $scope.title = 'marker 1';

        $scope.windowoptions = {
            pixelOffset: new google.maps.Size(-1, -250, 'px', 'px'),
            visible: false
        };

    });