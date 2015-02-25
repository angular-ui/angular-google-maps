(function () {
  angular.module('appMaps', ['uiGmapgoogle-maps'])
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      v: '3.17'
    });
  })
  .controller('MapCtrl', ['$scope', 'uiGmapGoogleMapApi', 'MapFactory', '$interval',
    function ($scope, uiGmapGoogleMapApi, MapFactory, $interval) {
      console.log('MapCtrl Instantiating.');

      this.map = {};
      var self = this;

      var updateMarker = function (marker) {
        var marker = marker;
        uiGmapGoogleMapApi.then(function (maps) {
          self.map.markers = [marker];

          console.log('self.map.markers[0].miles is ' + self.map.markers[0].miles);

          var onMarkerClicked = function (marker) {
            marker.showWindow = true;
            $scope.$apply();
          };

          var onClickedFunction = function () {
            onMarkerClicked(marker);
          };

          for (var i = 0; i < self.map.markers.length; i++) {
            marker = self.map.markers[i];

            marker.onClicked = onClickedFunction;

            var anchor = marker.icon.anchor;
            marker.icon.anchor =
            new google.maps.Point(anchor[0], anchor[1]);
          }
        });
      };

      var currentSeq = 0;
      var replay = function () {
        console.log('replaying.');

        updateMarker(MapFactory.updateMarkersModel(currentSeq));

        if (6 - currentSeq - 1 > 0) {
          currentSeq++;
        } else {
          console.log('No more sequences to replay. ' +
          'Stopping replay.');
          currentSeq = 0;
          $interval.cancel(interval);
        }
      };

      var startReplay = function () {
        console.log('Starting replay.');
        // set everything to zero right away                            
        if (currentSeq === 0) {
          replay();
        }

        interval = $interval(replay, 2000);
      };

      uiGmapGoogleMapApi.then(function (maps) {
        self.map.display = MapFactory.display;
        self.map.polys = MapFactory.polys;
        self.original = MapFactory.original;
        startReplay();
      });
    }
  ]).factory('MapFactory', function() {
    var display = {
      center: {
        latitude: 42.194576,
        longitude: -122.709477
      },
      zoom: 13,
      control: {}
    };

    var polys = new Array({
      id: 1,
      path: [{
        "latitude": 42.194603,
        "longitude": -122.710070
      }, {
        "latitude": 42.195239,
        "longitude": -122.711154
      }, {
        "latitude": 42.195931,
        "longitude": -122.712366
      }, {
        "latitude": 42.196741,
        "longitude": -122.713889
      }, {
        "latitude": 42.196988,
        "longitude": -122.714426
      }, {
        "latitude": 42.197091,
        "longitude": -122.714447
      }, {
        "latitude": 42.197703,
        "longitude": -122.714179
      }, {
        "latitude": 42.198538,
        "longitude": -122.713729
      }, {
        "latitude": 42.199913,
        "longitude": -122.712902
      }, {
        "latitude": 42.200143,
        "longitude": -122.712731
      }, {
        "latitude": 42.201454,
        "longitude": -122.710982
      }],
      stroke: {
        color: '#0000FF',
        weight: 5,
        opacity: 0.5
      },
      editable: false,
      draggable: false,
      geodesic: true,
      fit: true,
      visible: true
    });


    var updateMarkersModel = function(seq) {
      console.log('seq: ' + seq);
      var testData = [{
        "bib": 1,
        "miles": 0,
        "latitude": 42.194603,
        "longitude": -122.710070
      }, {
        "bib": 1,
        "miles": 3.5,
        "latitude": 42.195415,
        "longitude": -122.711459
      }, {
        "bib": 1,
        "place": 2,
        "miles": 6.5,
        "lap": 1,
        "latitude": 42.196624,
        "longitude": -122.713841
      }, {
        "bib": 1,
        "miles": 10,
        "latitude": 42.200232,
        "longitude": -122.712511
      }, {
        "bib": 1,
        "miles": 14,
        "latitude": 42.204412,
        "longitude": -122.709829
      }, {
        "bib": 1,
        "miles": 15.6,
        "latitude": 42.207607,
        "longitude": -122.709399
      }];

      //make a marker for each runner in the supplied list.
      //  either all, favorites, leaders, keymatchups.
      var marker, runner, profile;
      runner = testData[seq];

      marker = {
        id: 1,
        latitude: runner.latitude,
        longitude: runner.longitude,
        icon: {
          url: 'http://upload.wikimedia.org/wikipedia/commons/1/1d/Smile_icon_32x32.png',
          anchor: [0, 32]
        },
        bib: 1,
        miles: runner.miles,
        showWindow: false
      };

      return marker;
    };

    return {
      display: display,
      polys: polys,
      updateMarkersModel: updateMarkersModel
    };
  });
})();