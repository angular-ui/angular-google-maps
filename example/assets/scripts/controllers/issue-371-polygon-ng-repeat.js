angular.module("angular-google-maps-example", ["google-maps"]).value("rndAddToLatLon",function () {
  return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1)
}).controller("controller", ['$rootScope', '$scope', '$location', '$http', function ($rootScope, $scope, $location, $http) {
      $scope.map = {
        center: {
          latitude: -22.912122112782, longitude: -43.233883213252
        },
        options: {
          disableDefaultUI: false,
          panControl: true,
          navigationControl: true,
          scrollwheel: true,
          scaleControl: false
        },
        zoom: 15,
        polygons: []
      };

      $scope.polys = [
        {
          id: 1,
          clickable: true,
          draggable: false,
          editable: false,
          visible: true,
          geodesic: false,
          stroke: {weight: 1, color: "#000080", opacity: 1},
          fill: {color: "#FFCE00", opacity: 1},
          path: [
            {latitude: -22.840109991554, longitude: -43.604843616486},
            {latitude: -22.895785581504, longitude: -43.660461902618},
            {latitude: -22.923614814482, longitude: -43.480560779572}
          ]
        },
        {   id: 2,
          clickable: true,
          draggable: false,
          editable: false,
          visible: true,
          geodesic: false,
          stroke: {weight: 1, color: "black", opacity: 1},
          fill: {color: "#FFCE00", opacity: "0.3"},
          path: [
            {latitude: -22.220105243267, longitude: -42.533525750041},
            {latitude: -22.221535457024, longitude: -42.510480210185},
            {latitude: -22.241159694484, longitude: -42.517046257854},
            {latitude: -22.237336361699, longitude: -42.531315609813},
            {latitude: -22.227633565887, longitude: -42.534770295024}
          ]
        },
        {   id: 3,
          clickable: true,
          draggable: false,
          editable: false,
          visible: true,
          geodesic: true,
          stroke: {weight: 1, color: "red", opacity: 1},
          fill: {color: "#0A67A3", opacity: "0.3"},
          path: [
            {latitude: -22.912122112782, longitude: -43.233883213252},
            {latitude: -22.912658229953, longitude: -43.233333360404},
            {latitude: -22.913135051277, longitude: -43.232568930835},
            {latitude: -22.914049160006, longitude: -43.231040071696},
            {latitude: -22.915007732268, longitude: -43.229344915599},
            {latitude: -22.915096671619, longitude: -43.229065965861},
            {latitude: -22.914958321493, longitude: -43.228862117976},
            {latitude: -22.91306587523, longitude: -43.227215241641},
            {latitude: -22.911054813301, longitude: -43.225868772715},
            {latitude: -22.910516219169, longitude: -43.230718206614},
            {latitude: -22.910317334098, longitude: -43.231544326991},
            {latitude: -22.910335246119, longitude: -43.231946658343},
            {latitude: -22.910432218057, longitude: -43.2324991934},
            {latitude: -22.9106644563, longitude: -43.233437966555},
            {latitude: -22.910508807309, longitude: -43.233000766486},
            {latitude: -22.9113932865, longitude: -43.2337786071}
          ]
        }
      ];

      setTimeout(function () {
        $scope.map.polygons = $scope.polys;
        console.log('plota poly');
        $scope.$apply();
      }, 3600);
    }]);