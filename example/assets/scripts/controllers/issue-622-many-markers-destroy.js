//<script src="http://maps.googleapis.com/maps/api/js?libraries=weather,geometry,visualization&sensor=false&language=en&v=3.16"></script>
angular.module("app", ["google-maps".ns()])

.value("rndAddToLatLon", function () {
  return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1);
})

.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
  GoogleMapApi.configure({
    //    key: 'your api key',
    v: '3.16',
    libraries: 'weather,geometry,visualization'
  });
}])

.run(['$templateCache', function ($templateCache) {
  $templateCache.put('genMarkers.tpl.html',
  '<button class="btn btn-sm btn-primary" ng-class="{\'btn-warning\': danger}" ' +
  'ng-click="controlClick()">gen markers</button>'
  );

  $templateCache.put('genMarkersInput.tpl.html',
    '<div class="input-group">' +
    '<input type="text" class="form-control" ng-model="numberOfMarkers">' +
    '</div>'
  );
}])

.controller('controlCtrl', function ($scope) {
  $scope.controlText = 'I\'m a custom control';
  $scope.danger = false;
  $scope.controlClick = function () {
    $scope.danger = !$scope.danger;
    alert('custom control clicked!')
  };
})

.controller("mainCtrl",[
'$scope', '$timeout', 'Logger'.ns(),
'$http', 'rndAddToLatLon','GoogleMapApi'.ns(), function (
  $scope, $timeout, $log,
  $http, rndAddToLatLon,GoogleMapApi) {
    $log.doLog = true

    GoogleMapApi.then(function(maps) {

    });

    var versionUrl = (window.location.host === "rawgithub.com" || window.location.host === "rawgit.com") ?
    "http://rawgit.com/angular-ui/angular-google-maps/master/package.json" : "/package.json";

    $http.get(versionUrl).success(function (data) {
      if (!data){
        console.error("no version object found!!");
        $scope.version = data.version;
      }
    });

    var createRandomMarker = function (i, bounds, idKey) {
      var lat_min = bounds.southwest.latitude,
      lat_range = bounds.northeast.latitude - lat_min,
      lng_min = bounds.southwest.longitude,
      lng_range = bounds.northeast.longitude - lng_min;

      if (idKey == null)
        idKey = "id";

        var latitude = lat_min + (Math.random() * lat_range);
        var longitude = lng_min + (Math.random() * lng_range);
        var ret = {
          latitude: latitude,
          longitude: longitude,
          title: 'm' + i
        };
        ret[idKey] = i;
        return ret;
      };

      var genRandomMarkers = function (numberOfMarkers, scope) {
        var markers = [];
        for (var i = 0; i < numberOfMarkers; i++) {
          markers.push(createRandomMarker(i, scope.map.bounds))
        }
        return markers;
      };

      angular.extend($scope, {
        map: {
          control: {},
          version: "uknown",
          heatLayerCallback: function (layer) {
            //set the heat layers backend data
            var mockHeatLayer = new MockHeatLayer(layer);
          },
          center: {
            latitude: 45,
            longitude: -73
          },
          options: {
            streetViewControl: false,
            panControl: false,
            maxZoom: 20,
            minZoom: 3
          },
          zoom: 3,
          dragging: false,
          bounds: {},
          markers: [
          {
            id: 1,
            latitude: 45,
            longitude: -74,
            showWindow: false,
            title: 'Marker 2',
            options: {
              animation: 1
            }
          },
          {
            id: 2,
            latitude: 15,
            longitude: 30,
            showWindow: false,
            title: 'Marker 2'
          },
          {
            id: 3,
            icon: 'assets/images/plane.png',
            latitude: 37,
            longitude: -122,
            showWindow: false,
            title: 'Plane'
          }
          ],
        }
      });

      $scope.genRandomMarkers = function (numberOfMarkers) {
        return genRandomMarkers(numberOfMarkers, $scope);
      };

      $timeout(function () {
        var markers = $scope.genRandomMarkers(1000);
        console.info(markers);
        $scope.map.markers = markers;
      }, 2000);

      $timeout(function () {
        $scope.map.markers = $scope.genRandomMarkers(2000);
      }, 10000);

    }]);
