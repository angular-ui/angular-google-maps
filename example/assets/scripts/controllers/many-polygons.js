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
    .controller('ctrl', ['$scope', "uiGmapLogger", "uiGmapGoogleMapApi", "$http",
      function ($scope, $log, uiGmapGoogleMapApi, $http) {
        $scope.map = {
          center: {
            latitude: 26.153215225012733,
            longitude: -81.80121597097774
          },
          pan: true,
          zoom: 16,
          refresh: false,
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
          $http.get('assets/json/many_polygons.json').then(function (data) {
            $scope.map.polys = data.data;
          });

        });

        $scope.$onRootScope("clearButtonClicked", function () {
          $scope.map.polys = [];
        });

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
