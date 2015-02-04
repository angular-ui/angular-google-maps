angular.module('uiGmapgoogle-maps.directives.api.utils')
.service 'uiGmapFitHelper', [ 'uiGmapLogger', 'uiGmap_async',
  ($log, _async) ->
    fit: (gMarkers, gMap) ->
      if gMap and gMarkers and gMarkers.length > 0
        bounds = new google.maps.LatLngBounds()
        everSet = false
        gMarkers.forEach (gMarker) =>
          if gMarker
            everSet = true unless everSet
            bounds.extend(gMarker.getPosition())
        gMap.fitBounds(bounds) if everSet
]
