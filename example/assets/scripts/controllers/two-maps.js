(function () {
  var module = angular.module("angular-google-maps-example", ["google-maps"]);
}());

var rndAddToLatLon = function () {
  return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1)
}

function DebugController($scope, $timeout, $log, $http, nggmapIsReady) {
  // Enable the new Google Maps visuals until it gets enabled by default.
  // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
  google.maps.visualRefresh = true;

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
        _.defer(function () {
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
  nggmapIsReady.promise(2).then(function (instances) {
    instances.forEach(function(inst){
      inst.map.ourID = inst.instance;
    });
  });

  var origCenter = {latitude: $scope.map.center.latitude, longitude: $scope.map.center.longitude};
}
