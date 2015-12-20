angular.module('appMaps', ['uiGmapgoogle-maps'])

  .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
  //  key: 'your api key',
  //    v: '3.20',
      libraries: 'places'
    });
  }])
  
  .controller('mainCtrl', ['$scope', '$log', 'uiGmapGoogleMapApi', function ($scope, $log, GoogleMapApi) {
      angular.extend($scope, {
        map: {center: 
          {
            latitude: 40.1451, 
            longitude: -99.6680  
          }, 
          zoom: 4 
        },
        searchbox: { 
          template:'searchbox.tpl.html', 
          events:{
            places_changed: function (searchBox) {}
          }
        },
        options: {
          scrollwheel: false
        }
      });
      
      GoogleMapApi.then(function(maps) {
        maps.visualRefresh = true;
      });
  }]);