// Code goes here

angular.module('app', ['uiGmapgoogle-maps'])
  .controller('mainCtrl', function (uiGmapLogger, $scope, $timeout) {
    uiGmapLogger.currentLevel = uiGmapLogger.LEVELS.debug;

    $scope.number = 0;
    $scope.map = {
      center: {
        latitude: 35.027469,
        longitude: -111.022753
      },
      zoom: 4,
      markerModels: [
        {
          id: 0,
          coords: {
            latitude: 35.027469,
            longitude: -111.022753
          },
          lState: 'success'
        },
        {
          id: 1,
          coords: {
            latitude: 35.127469,
            longitude: -111.122753
          },
          lState: 'info'
        }
      ],
      getMarkerOptions: function (markerModel) {
        if (!markerModel)
          return;
        var opts =  {
          icon: ' ',
          labelContent: '<h4><span class="label label-' + markerModel.lState +'">' + markerModel.id + '</span></h4>',
          labelAnchor: "20 10",
          zIndex: -1 * markerModel.id //inverse to put first on top
        };
        return opts;
      },
      clickedMarker: function (gMarker, eventName, markerModel) {
        if ($scope.map.windowModel) {
          $scope.map.windowModel.show = false;
        }
        markerModel.show = true;
        $scope.map.windowModel = markerModel;
      }
    };
  });