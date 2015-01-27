angular.module('appMaps', ['uiGmapgoogle-maps']).controller('mapCtrl', mapController);

mapController.$inject = ['uiGmapGoogleMapApi'];

function mapController(GoogleMapApi) {
  GoogleMapApi.then(function (maps) {
    maps.visualRefresh = true
  });

  var viewmodel = this;

  var blueicon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  var redicon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  var testlocation = {
    id: 'abc123',
    name: 'CN Tower',
    latitude: 43.642496,
    longitude: -79.386954
  };

  viewmodel.changeIcon = changeIcon;
  viewmodel.changeObject = changeObject;
  viewmodel.changeOptionsToLabel= changeOptionsToLabel;
  viewmodel.changeOptionsToNotLabel= changeOptionsToNotLabel;
  viewmodel.changePath= changePath;
  viewmodel.changeFill= changeFill;
  viewmodel.changeStroke= changeStroke;
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
    ],
    polygons: [
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
        fill:{ color: '#2c8aa7', opacity: '0.3' },
        editable: true,
        draggable: true,
        geodesic: true,
        visible: true
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
    var childMarker = viewmodel.markerControl.getChildMarkers().get('abc123');
    childMarker.updateModel(newMarker);
    viewmodel.map.markers[0] = childMarker.model;
  }

  function changeOptionsToLabel(){
    viewmodel.map.markers[0].options = {
      labelContent: "I'm now a Marker Label!",
        labelAnchor: "5 0",
        labelClass: "marker-labels"
    };
  }
  function changeOptionsToNotLabel(){
    viewmodel.map.markers[0].options = {};
  }

  function changePath(){
    viewmodel.map.polygons[0].path[0].latitude += 5;
  }
  function changeFill(){
    viewmodel.map.polygons[0].fill.color = '#ec19d0';
  }
  function changeStroke(){
    viewmodel.map.polygons[0].stroke.color = '#ec19d0';
  }
}
