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
  $templateCache.put('genMarkersInput.tpl.html',
  '<div>' +
  '<button type="button" class="btn btn-sm btn-primary pull-left"' +
  'ng-click="genClick()">gen markers</button>' +
  '<div class="input-group">' +
  '<input type="text" class="form-control pull-left" ng-model="numOfMarkers.val">' +
  '</div>' +
  '<div>{{checked ? "overwrite" : "Dont overwrite"}}<input type="checkbox" ng-model="checked" ng-init="checked=false" />'+
  '</div>'
  );

  $templateCache.put('clearMarkers.tpl.html',
  '<button type="button"  class="btn btn-sm btn-danger"' +
  'ng-click="clearClick()">clear</button>');
}])

.factory('channel', function(){
  return function () {
    var callbacks = [];
    this.add = function (cb) {
      callbacks.push(cb);
    };
    this.invoke = function () {
      var args = arguments;
      callbacks.forEach(function (cb) {
        cb.apply(undefined,args);
      });
    };
    return this;
  };
})
.service('genMarkersChannel',['channel',function(channel){
  return new channel()
}])
.service('clearMarkersChannel',['channel',function(channel){
  return new channel()
}])

.controller('controlCtrl', ['$scope','clearMarkersChannel','genMarkersChannel',
function ($scope, clearMarkersChannel,genMarkersChannel) {
  angular.extend($scope, {
    clearClick: function () {
      clearMarkersChannel.invoke();
    },
    genClick: function () {
      genMarkersChannel.invoke(parseInt($scope.numOfMarkers.val),$scope.checked);
    },
    numOfMarkers: {val: 0}
  });
}])

.controller("mainCtrl",[
'$scope', '$timeout', 'Logger'.ns(),
'$http', 'rndAddToLatLon','GoogleMapApi'.ns(),
'clearMarkersChannel','genMarkersChannel', function (
  $scope, $timeout, $log,
  $http, rndAddToLatLon,GoogleMapApi,
  clearMarkersChannel,genMarkersChannel) {
    var staticMarkers =  [
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
    ];

    genMarkersChannel.add(function(numOfMarkers, overwriteWStatic){
      $timeout(function(){
        $scope.map.markers = $scope.genRandomMarkers(numOfMarkers);
        if(overwriteWStatic){
          $scope.map.markers = staticMarkers;
        }
      },0);
    });
    clearMarkersChannel.add(function(){
      $scope.map.markers = []
    });

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
          markers: staticMarkers
        }
      });

      $scope.genRandomMarkers = function (numberOfMarkers) {
        return genRandomMarkers(numberOfMarkers, $scope);
      };

    }]);
