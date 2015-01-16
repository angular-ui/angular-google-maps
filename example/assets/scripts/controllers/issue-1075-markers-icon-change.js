angular.module('appMaps', ['uiGmapgoogle-maps'])
    .controller('mapIconChangeCtrl', mapController);

mapController.$inject = ['uiGmapGoogleMapApi'];

function mapController(GoogleMapApi) {
    GoogleMapApi.then(function(maps) {
        maps.visualRefresh=true
    });

    var viewmodel = this;

    var blueicon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    var redicon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    var testlocation = {
        id: 'abc123',
        name: 'CN Tower',
        latitude: 43.642496,
        longitude: -79.386954
    }

    viewmodel.changeIcon = changeIcon;
    viewmodel.changeObject = changeObject;

    viewmodel.markerControl = {}

    viewmodel.map = {
        center: {
            latitude: 43.642496,
            longitude: -79.386954
        },
        zoom: 12,
        markers: [
            {
                location: testlocation,
                id: 'abc123',
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
        ]
    };

    function changeIcon() {
        var newicon = redicon;
        if (viewmodel.map.markers[0].icon === redicon) {
            newicon = blueicon;
        }

        console.log('changing the icon property from ' +
        viewmodel.map.markers[0].icon + ' to ' + newicon);

        viewmodel.map.markers[0].icon = newicon;
    }

    function changeObject() {
        var newicon = redicon;
        if (viewmodel.map.markers[0].icon === redicon) {
            newicon = blueicon;
        }

        var newMarker = {
            location: testlocation,
            id: 'abc123',
            icon: newicon
        };

        console.log('changing the marker object from one with icon ' +
        viewmodel.map.markers[0].icon + ' to an object with icon ' + newicon);
        var childMarker = viewmodel.markerControl.getChildMarkers().get('abc123')
        childMarker.updateModel(newMarker)
        viewmodel.map.markers[0] = childMarker.model

    }
}
