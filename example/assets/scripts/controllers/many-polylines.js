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
    .config([
      "$provide", function ($provide) {
        return $provide.decorator("$rootScope", [
          "$delegate", function ($delegate) {
            Object.defineProperty($delegate.constructor.prototype, "$onRootScope", {
              value: function (name, listener) {
                var unsubscribe;
                unsubscribe = $delegate.$on(name, listener);
                this.$on("$destroy", unsubscribe);
                return unsubscribe;
              },
              enumerable: false
            });
            return $delegate;
          }
        ]);
      }
    ])
    .controller('mapWidgetCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
      $scope.polyButton = {
        controlText: 'make polys',
        controlClick: function () {
          $rootScope.$emit("polyButtonClicked");
        }
      };
      $scope.clearWidget = {
        controlText: 'clear',
        controlClick: function () {
          $rootScope.$emit("clearButtonClicked");
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
    .controller('ctrl', ['$scope', "uiGmapLogger", "uiGmapGoogleMapApi", function ($scope, $log, uiGmapGoogleMapApi) {
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
      var rawPolys = [];
      uiGmapGoogleMapApi.then(function () {
        rawPolys = [
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
            editable: false,
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
            editable: false,
            draggable: true,
            geodesic: true,
            visible: true
          }
        ];
      });

      var createPolys = function () {
        $log.info('polys should be injected');
        $scope.map.polys = rawPolys;
      };
      $scope.$onRootScope("polyButtonClicked", function () {
        createPolys();
        var poly = rawPolys[0];
        var somePolys = _.range(500).map(function (num, i) {
          var clonedPoly = _.extend({}, poly);
          var paths = clonedPoly.path.map(function (p) {
            return {
              latitude: p.latitude,
              longitude: p.longitude + i
            }
          });
          clonedPoly.id = i+1;
          clonedPoly.path = paths;
          return clonedPoly;
        });
        $scope.map.polys = somePolys;
      });
      $scope.$onRootScope("clearButtonClicked", function () {
        $scope.map.polys = [];
      });
      //add beginDraw as a subscriber to be invoked by the channel, allows controller to controller coms

    }])
    .run(['$templateCache', 'uiGmapLogger', function ($templateCache, Logger) {
      Logger.doLog = true;
      Logger.info('polyButton.tpl.html should be in cache');
      $templateCache.put('polyButton.tpl.html',
        '<button class="btn btn-lg btn-primary"  ng-click="polyButton.controlClick()">{{polyButton.controlText}}</button>');
      $templateCache.put('clear.tpl.html',
        '<button class="btn btn-lg btn-primary"  ng-click="clearWidget.controlClick()">{{clearWidget.controlText}}</button>');
    }]);
})(window, angular);
