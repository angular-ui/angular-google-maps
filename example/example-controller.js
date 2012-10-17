
(function () {
	var module = angular.module("angular-google-maps-example", ["google-maps"]);
}());

function ExampleController ($scope) {
	
	angular.extend($scope, {
		
		/** the initial center of the map */
		centerProperty: {
			lat: 45,
			lng: -73
		},
		
		/** the initial zoom level of the map */
		zoomProperty: 8,
		
		/** list of markers to put in the map */
		markersProperty: [ {
				latitude: 45,
				longitude: -74
			}],
		
		// These 2 properties will be set when clicking on the map
		clickedLatitudeProperty: null,	
		clickedLongitudeProperty: null,
	});
}