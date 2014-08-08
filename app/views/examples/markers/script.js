angular.module('appMaps', ['google-maps'])
    .controller('mainCtrl', function($scope) {

        // Dynamically insert the CSS style required for the markers with label.
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.labelMarker { font-size: 15px; font-weight: bold; color: #FFFFFF;font-family: "DINNextRoundedLTProMediumRegular"; border-radius: 50%; background-color: blue;width: 20px;text-align: center;vertical-align: middle;line-height: 20px; }';
        document.getElementsByTagName('head')[0].appendChild(style); 


        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, bounds: {}};
        $scope.options = {scrollwheel: false};
        
        var createRandomMarker = function (i, bounds, idKey) {
            var lat_min = bounds.southwest.latitude,
                lat_range = bounds.northeast.latitude - lat_min,
                lng_min = bounds.southwest.longitude,
                lng_range = bounds.northeast.longitude - lng_min;

            if (idKey == null) {
                idKey = "id";
            }

            var latitude = lat_min + (Math.random() * lat_range);
            var longitude = lng_min + (Math.random() * lng_range);
            // Note, the label* properties are only used if isLabel='true' in the directive.
            var ret = {
              options: {draggable: true,
                labelAnchor: '10 39',
                labelContent: i,
                labelClass: 'labelMarker'},
                latitude: latitude,
                longitude: longitude,
                title: 'm' + i
            };
            ret[idKey] = i;
            return ret;
        };
        $scope.randomMarkers = [];
        $scope.randomMarkersWithLabel = [];
        // Get the bounds from the map once it's loaded
        $scope.$watch(function() { return $scope.map.bounds; }, function(nv, ov) {
            // Only need to regenerate once
            // Create 25 markes with label, 25 without.
            if (!ov.southwest && nv.southwest) {
                var markers = [];
                for (var i = 0; i < 25; i++) {
                    markers.push(createRandomMarker(i, $scope.map.bounds))
                }
                $scope.randomMarkers = markers;
                markers = [];
                for (var i = 25; i < 50; i++) {
                    markers.push(createRandomMarker(i, $scope.map.bounds))
                }
                $scope.randomMarkersWithLabel = markers;

            }
        }, true);
    });
