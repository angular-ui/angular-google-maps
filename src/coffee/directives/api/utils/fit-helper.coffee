angular.module("google-maps.directives.api.utils")
.factory "FitHelper", ["BaseObject", "Logger", (BaseObject,$log) ->
    class FitHelper extends BaseObject
      fit: (gMarkers, gMap) ->
        if gMap and gMarkers and gMarkers.length > 0
          bounds = new google.maps.LatLngBounds();
          everSet = false
          _async.each gMarkers, (gMarker) =>
            if gMarker
              everSet = true unless everSet
              bounds.extend(gMarker.getPosition())
          , () =>
            gMap.fitBounds(bounds) if everSet
  ]
