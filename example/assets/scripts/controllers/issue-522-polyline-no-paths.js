(function (window, ng) {
  ng.module('app', ['uiGmapgoogle-maps'])
    .factory('channel', function () {
      return function () {
        var callbacks = [];
        this.add = function (cb) {
          callbacks.push(cb);
        };
        this.invoke = function () {
          callbacks.forEach(function (cb) {
            cb();
          });
        };
        return this;
      };
    })
    .service('polyChannel', ['channel', function (channel) {
      return new channel()
    }])
    .service('clearChannel', ['channel', function (channel) {
      return new channel()
    }])
    .controller('mapWidgetCtrl', ['$scope', 'polyChannel', 'clearChannel',
      function ($scope, polyChannel, clearChannel) {
        $scope.polyButton = {
          controlText: 'make polys',
          controlClick: function () {
            polyChannel.invoke()
          }
        };
        $scope.clearWidget = {
          controlText: 'clear',
          controlClick: function () {
            clearChannel.invoke()
          }
        };
      }])
    .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
      GoogleMapApi.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'geometry'
      });
    }])
    .controller('ctrl', ['$rootScope', '$scope', "uiGmapLogger", 'polyChannel', 'clearChannel',
      function ($rootScope, $scope, $log, polyChannel, clearChannel) {
        $scope.map = {
          center: {
            latitude: 45,
            longitude: -73
          },
          pan: true,
          zoom: 4,
          refresh: false,
          options: {
            disableDefaultUI: true
          },
          events: {},
          bounds: {},
          polys: [],
          polyEvents: {
            click: function (gPoly, eventName, polyModel) {
              window.alert("Poly Clicked: id:" + polyModel.$id + ' ' + JSON.stringify(polyModel.path));
            }
          },
          draw: undefined
        };
        var createPolys = function () {
          $log.info('polys should be injected');
          $scope.map.polys = [
            {
              id: 1,
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
              visible: true,
              icons: [
                {
                  icon: {
                    path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
                  },
                  offset: '25px',
                  repeat: '50px'
                }
              ]
            },
            {
              id: 2,
              path: [
                {
                  latitude: 47,
                  longitude: -74
                },
                {
                  latitude: 32,
                  longitude: -89
                },
                {
                  latitude: 39,
                  longitude: -122
                },
                {
                  latitude: 62,
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
              visible: true,
              icons: [
                {
                  icon: {
                    path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
                  },
                  offset: '25px',
                  repeat: '50px'
                }
              ]
            },
            {
              id: 3,
              path: google.maps.geometry.encoding.decodePath("uowfHnzb}Uyll@i|i@syAcx}Cpj[_wXpd}AhhCxu[ria@_{AznyCnt^|re@nt~B?m|Awn`G?vk`RzyD}nr@uhjHuqGrf^ren@"),
              stroke: {
                color: '#4EAE47',
                weight: 3
              },
              editable: false,
              draggable: false,
              geodesic: false,
              visible: true
            }
          ]
        };
        //add beginDraw as a subscriber to be invoked by the channel, allows controller to controller coms
        polyChannel.add(createPolys);
        clearChannel.add(function () {
          $scope.map.polys = [];
        });
      }])
    .run(['$templateCache', 'uiGmapLogger',function ($templateCache, Logger) {
      Logger.doLog = true;
      Logger.info('polyButton.tpl.html should be in cache');
      $templateCache.put('polyButton.tpl.html',
        '<button class="btn btn-lg btn-primary"  ng-click="polyButton.controlClick()">{{polyButton.controlText}}</button>');
      $templateCache.put('clear.tpl.html',
        '<button class="btn btn-lg btn-primary"  ng-click="clearWidget.controlClick()">{{clearWidget.controlText}}</button>');
    }]);
})(window, angular);
