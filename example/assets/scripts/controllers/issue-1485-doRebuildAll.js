angular.module('testApp', ['uiGmapgoogle-maps'])
.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApiProvider) {
  GoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization,places'
    });
}])
.controller('TestController', ['$scope','uiGmapGoogleMapApi', function ($scope,GoogleMapApi) {

  $scope.map = {
		center: {
			latitude: 33.7550,
			longitude: -84.3900
		},
		zoom: 14,
		options: {
			scrollwheel: false,
			panControl: false,
			scaleControl: false,
			draggable: true,
			doRebuildAll: false,
			maxZoom: 22,
			minZoom: 0
		},
		clusterOptions: {
        averageCenter: true,
        minimumClusterSize: 10,
        zoomOnClick: true
		},
		clusterEvents: {},
		refresh : false,
		bounds: {},
		events: {
			idle: function() {
				console.log('idle');
			}
		},
	};

  $scope.addMarker = function(){
    var marker = buildMarker();
    $scope.markers.push(marker);
  }

  buildMarker = function(){
    var randomLat = getRandomInt(336550, 338550) / 10000;
    var randomLng =  getRandomInt(-843900,-843700) / 10000;
    return {
      id: nextId(),
      coords: {
        latitude: randomLat,
        longitude: randomLng,
      },
      options: $scope.markerOptions
    }
  }

	nextId = function() {
	  return $scope.markers.length + 1;
	}

	getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

	$scope.markers = [];

  GoogleMapApi.then(function(maps) {
    console.log('start');
    $scope.maps = maps;
    $scope.markerOptions = {
      animation: $scope.maps.Animation.DROP,
      visible: true
    }
    $scope.addMarker();
    $scope.addMarker();
    $scope.addMarker();
    $scope.doRebuildAll = false;
  });

}]);
