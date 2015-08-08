angular.module('uiGmapgoogle-maps.wrapped')
.service('uiGmapMarkerSpiderfier', [ 'uiGmapGoogleMapApi', function(GoogleMapApi) {
  var self = this;
  //BEGIN REPLACE
  @@REPLACE_W_LIBS
  //END REPLACE
  GoogleMapApi.then(function(){
    self.OverlappingMarkerSpiderfier.initializeGoogleMaps(window.google);
  });
  return this.OverlappingMarkerSpiderfier;
}]);
