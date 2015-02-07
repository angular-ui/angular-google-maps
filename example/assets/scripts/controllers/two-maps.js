angular.module("angular-google-maps-example", ['uiGmapgoogle-maps'])

.value("rndAddToLatLon", function () {
  return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1);
})

.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
  GoogleMapApi.configure({
    //    key: 'your api key',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
  });
}])

.controller("DebugController",[
'$scope', '$timeout', 'uiGmapLogger', '$http', 'rndAddToLatLon','uiGmapGoogleMapApi', 'uiGmapIsReady',
function ($scope, $timeout, $log, $http, rndAddToLatLon,GoogleMapApi,IsReady) {


  versionUrl = window.location.host === "rawgithub.com" ? "http://rawgithub.com/nlaplante/angular-google-maps/master/package.json" : "/package.json";

  $http.get(versionUrl).success(function (data) {
    if (!data)
      console.error("no version object found!!");
      $scope.version = data.version;
    });


    angular.extend($scope, {
      map: {
        control: {},
        center: {
          latitude: 45,
          longitude: -74
        },
        marker: {
          id: 0,
          latitude: 45,
          longitude: -74,
          options: {
            visible: false
          }
        },
        marker2: {
          id: 0,
          latitude: 45.2,
          longitude: -74.5
        },
        zoom: 7,
        options: {
          draggable:true,
          disableDefaultUI: true,
          panControl: false,
          navigationControl: false,
          scrollwheel: false,
          scaleControl: false
        },
        refresh: function () {
          $scope.map.control.refresh(origCenter);
        }
      },
      map2: {
        control: {},
        center: {
          latitude: 52.2,
          longitude: -80
        },
        showMap: true,
        marker: {
          id: 0,
          latitude: 70,
          longitude: -76,
          options: {
            visible: true
          }
        },
        marker2: {
          id: 0,
          latitude: 50.2,
          longitude: -80.5
        },
        zoom: 4,
        refresh: function () {
          $scope.map2.control.refresh({latitude: 32.779680, longitude: -79.935493});
          $scope.map2.showMap = false;
          $timeout(function () {
            $scope.map2.showMap = true;
          });
        },
        markers3: [
        {
          id: 1,
          time: "12:00PM",
          coords: {
            latitude: 52.2,
            longitude: -80.5
          },
          icon: "assets/images/plane.png",
          lastSignal: "Never",
          click: function () {
            this.show = true;
            this.lastSignal = Math.round(Date.now()).toString();
            $scope.apply();
          },
          closeClick: function () {
            this.showWindow = false;
          },
          show: false
        }
        ],
        onMarkerClick: function (m) {
          m.lastSignal = Math.round(Date.now()).toString();
          m.show = true;
          $scope.map2.markers3.length = 0;
          $scope.map2.markers3 = [m];
          $scope.$apply();

        }
      }
    });

    GoogleMapApi.then(function(maps) {
      maps.visualRefresh = true;
    });

    IsReady.promise(2).then(function (instances) {
      instances.forEach(function(inst){
        inst.map.ourID = inst.instance;
      });
    });

    var origCenter = {latitude: $scope.map.center.latitude, longitude: $scope.map.center.longitude};
  }]);
