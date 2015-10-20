angular
  .module('appMaps', ['uiGmapgoogle-maps'])
  .controller('mainCtrl', function($scope, $log) {
    // Define map type options
    $scope.squaresMapType = {
      getTile: function(coord, zoom, ownerDocument) {
        var div = ownerDocument.createElement('div');
        div.innerHTML = coord;
        div.style.width = this.tileSize.width + 'px';
        div.style.height = this.tileSize.height + 'px';
        div.style.fontSize = '10';
        div.style.borderStyle = 'solid';
        div.style.borderWidth = '1px';
        div.style.borderColor = '#AAAAAA';
        return div;
      },
      tileSize: new google.maps.Size(256, 256),
      name: 'Black Squares',
      maxZoom: 19,
    };

    // Define map options
    $scope.map = {
      center: {
        latitude: 41.850033,
        longitude: -87.6500523
      },
      showOverlay: true,
      zoom: 10,
    };

  });
