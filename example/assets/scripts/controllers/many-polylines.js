(function (window, ng) {
  ng.module('app', ['uiGmapgoogle-maps'])
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
    .controller('ctrl', ['$scope', "uiGmapLogger", "uiGmapGoogleMapApi", "$http",
      function ($scope, $log, uiGmapGoogleMapApi, $http) {
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
          $http.get('assets/json/polylines.json').then(function (data) {
            rawPolys = data.data;
          });

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
            clonedPoly.id = i + 1;
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
