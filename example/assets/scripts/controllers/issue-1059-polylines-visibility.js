angular.module('appMaps', ['uiGmapgoogle-maps'])
  .controller('mainCtrl', function () {
    this.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, bounds: {}};
    this.polylines = [
      {
        id: 1,
        path: [
          { latitude: 45, longitude: -74 },
          { latitude: 30, longitude: -89 },
          { latitude: 37, longitude: -122 },
          { latitude: 60, longitude: -95 }
        ]
      },
      {
        id: 2,
        path: [
          { latitude: 47, longitude: -74 },
          { latitude: 32, longitude: -89 },
          { latitude: 39, longitude: -122 },
          { latitude: 62, longitude: -95 }
        ]
      }
    ].map(function(poly){
      poly.stroke= { color: '#6060FB', weight: 3 };
      poly.editable= false;
      poly.draggable= true;
      poly.geodesic= true;
      poly.visible= true;
      return poly;
    });

    this.toggleLine = function(index){
      this.polylines[index].visible = !this.polylines[index].visible;
    }
    this.toggleEditable = function(index){
      this.polylines[index].editable = !this.polylines[index].editable;
    }

  });
