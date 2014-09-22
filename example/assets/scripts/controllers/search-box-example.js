angular.module("search-box-example", ["google-maps".ns()])

.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
  GoogleMapApi.configure({
//    key: 'your api key',
    v: '3.16',
    libraries: 'places'
  });
}])

.run(['$templateCache', function ($templateCache) {
  $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="pac-controls" type="text" placeholder="Search Box">');
}])

.controller("SearchBoxController",['$scope', '$timeout', 'Logger'.ns(), '$http','GoogleMapApi'.ns()
    , function ($scope, $timeout, $log, $http, GoogleMapApi) {
  $log.doLog = true

  GoogleMapApi.then(function(maps) {
    //maps.visualRefresh = true;
    //$log.info('maps.visualRefresh');
  });

  angular.extend($scope, {
    map: {
      control: {},
      center: {
        latitude: 40.74349,
        longitude: -73.990822
      },
      zoom: 12,
      dragging: false,
      bounds: {},
      markers: []
    },
    searchbox: {
      template:'searchbox.tpl.html',
      position:'top-left',
      //parentdiv:'searchBoxParent',
      events: {
        places_changed: function (places) {
        }
      }

      
    }
  });


  

}]);