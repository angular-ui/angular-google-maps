angular.module('uiGmapgoogle-maps.wrapped')
.service('uiGmapMarkerSpiderfier', [ 'uiGmapGoogleMapApi', function(GoogleMapApi) {
  var self = this;
  /* istanbul ignore next */
  +function(){
    @@REPLACE_W_LIBS
  }.apply(self);

  GoogleMapApi.then(function(){
    self.OverlappingMarkerSpiderfier.initializeGoogleMaps(window.google);
  });
  return this.OverlappingMarkerSpiderfier;
}]);
