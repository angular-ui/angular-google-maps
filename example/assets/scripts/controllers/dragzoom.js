(function (window, ng) {
  ng.module('app', ['uiGmapgoogle-maps'])
    .controller('ctrl', ['$scope', "uiGmapLogger", "uiGmapGoogleMapApi",
      function ($scope, $log, GoogleMapApi) {
        $scope.map = {
          dragZoom: {options: {}},
          center: {
            latitude: 26.153215225012733,
            longitude: -81.80121597097774
          },
          pan: true,
          zoom: 16,
          refresh: false,
          events: {},
          bounds: {}
        };
        GoogleMapApi.then(function () {
          $scope.map.dragZoom = {
            options: {
              visualEnabled: true,
              visualPosition: google.maps.ControlPosition.LEFT,
              visualPositionOffset: new google.maps.Size(35, 0),
              visualPositionIndex: null,
              visualSprite: "http://maps.gstatic.com/mapfiles/ftr/controls/dragzoom_btn.png",
              visualSize: new google.maps.Size(20, 20),
              visualTips: {
                off: "Turn on",
                on: "Turn off"
              }
            }
          }
        });
      }]);

})(window, angular);
