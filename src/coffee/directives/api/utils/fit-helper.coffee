angular.module('uiGmapgoogle-maps.directives.api.utils')
.factory 'uiGmapFitHelper', [
  'uiGmapBaseObject', 'uiGmapLogger', 'uiGmap_async',
  (BaseObject, $log, _async) ->
    class FitHelper extends BaseObject
      fit: (gMarkers, gMap) ->
        if gMap and gMarkers and gMarkers.length > 0
          bounds = new google.maps.LatLngBounds()
          everSet = false
          _async.each gMarkers, (gMarker) =>
            if gMarker
              everSet = true unless everSet
              bounds.extend(gMarker.getPosition())
          .then ->
            gMap.fitBounds(bounds) if everSet
]
