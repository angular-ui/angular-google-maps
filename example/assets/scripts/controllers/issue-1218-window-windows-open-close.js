angular.module("angular-google-maps-example", ['uiGmapgoogle-maps'])
.controller("controller", function ($scope, $timeout, $log, $http) {

  var versionUrl = window.location.host === "rawgithub.com" ? "http://rawgithub.com/angular-ui/angular-google-maps/2.0.X/package.json" : "/package.json";

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
        longitude: -73
      },
      options: {
        panControl: false,
        maxZoom: 20,
        minZoom: 3
      },
      zoom: 3,
      dragging: false,
      bounds: {}
      ,
      virginia:{
        id:0,
        latitude: 38.766933,
        longitude: -78.156738
      },
      southCarolina:{
        id:0,
        doShow:false,
        latitude: 33.774581,
        longitude: -80.661621
      },
      texases:[
        {id:0,
          latitude: 35.115415,
          longitude: -101.535645
          },
        {id:1,
          latitude: 31.704803,
          longitude: -95.207520
          },
        {id:2,
          latitude: 29.969212,
          longitude: -101.140137
          }
      ],
      californias:[
        {id:0, doShow:false,
          latitude: 41.290190,
          longitude: -121.706543},
        {id:1,doShow:false,
          latitude: 37.662081,
          longitude: -118.937988},
        {id:2,doShow:false,
          latitude: 33.371825,
          longitude: -116.257324}
      ],
      canadas:[
        {id:0,
          latitude: 53.130294,
          longitude: -118.410645
        },
        {id:1,
          latitude: 53.288205,
          longitude: -103.425293
        },
        {id:2,
          latitude: 50.159305,
          longitude: -80.441895
        }
      ],
      openedCanadaWindows:{},
      onWindowCloseClick: function(gMarker, eventName, model){
        if(model.dowShow !== null && model.dowShow !== undefined)
          return model.doShow = false;

      },
      markerEvents: {
        click:function(gMarker, eventName, model){
          model.doShow = true;
          //if($scope.map.openedCanadaWindows.indexOf(model) < 0)
          $scope.map.openedCanadaWindows = model;
          //$scope.$evalAsync();
          //}
      }
    }}
  });

    $scope.map.canadas.forEach(function(model){
      model.closeClick = function(){
        model.doShow = false;
      };
    });

    var applyHandleCloseWShow = function (array){
      if(!array) return;
      array.forEach(function(model){
        //slap on additional common functions
          model.onWindowCloseClick = $scope.map.onWindowCloseClick;
      });
    };

    if(!$scope.map.windowsWShow)
      $scope.map.windowsWShow = [];

    applyHandleCloseWShow($scope.map.californias);
    //applyHandleCloseWShow($scope.map.texases, true);


    var allDoShowModels = $scope.map.californias.concat([$scope.map.southCarolina]);
    //delay show all show state windows
    $timeout(function(){
      allDoShowModels.forEach(function(model){
        if(!model) return;
        model.doShow = true;
        $scope.$evalAsync();
      });
    },3000);
});
