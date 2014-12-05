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
      $scope.make = {
        controlText: 'make polys',
        controlClick: function () {
          $rootScope.$emit("polyButtonClicked");
        }
      };
      $scope.add = {
        controlText: 'add',
        controlClick: function () {
          $rootScope.$emit("addClicked");
        }
      };
      $scope.clear = {
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
        uiGmapGoogleMapApi.then(function () {
        });

        var createPolys = function () {
          return  [
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
                color: '#ff6262',
                weight: 5
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
            }
          ];
        };
        $scope.$onRootScope("polyButtonClicked", function () {
          $scope.map.polys = createPolys();
        });
        $scope.$onRootScope("addClicked", function () {
          if (!$scope.map.polys || !$scope.map.polys.length > 0)
            return;
          var last = JSON.parse(JSON.stringify(_.last($scope.map.polys)));
          last.id += 1;
          last.path = last.path.map(function (p) {
            p.longitude += 2;
            return p;
          });
          $scope.map.polys.push(last);
        });
        $scope.$onRootScope("clearButtonClicked", function () {
          $scope.map.polys = [];
        });
        //add beginDraw as a subscriber to be invoked by the channel, allows controller to controller coms

      }])
    .run(['$templateCache', 'uiGmapLogger', function ($templateCache, Logger) {
      $templateCache.put('widgets.tpl.html',
          '<div>' +
          '<button class="btn btn-lg btn-primary pull-left"  ng-click="clear.controlClick()">{{clear.controlText}}</button>' +
          '<button class="btn btn-lg btn-primary pull-left"  ng-click="make.controlClick()">{{make.controlText}}</button>' +
          '<button class="btn btn-lg btn-primary pull-left"  ng-click="add.controlClick()">{{add.controlText}}</button>' +
          '</div>');
    }]);
})(window, angular);
