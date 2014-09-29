angular.module("google-maps.directives.api.utils".ns())
.factory "FitHelper".ns(), [
  "BaseObject".ns(), "Logger".ns(), "_async".ns(),
  (BaseObject, $log, _async) ->
    class FitHelper extends BaseObject
      fit: (gMarkers, gMap) ->
        if gMap and gMarkers and gMarkers.length > 0
          bounds = new google.maps.LatLngBounds();
          everSet = false
          _async.each gMarkers, (gMarker) =>
            if gMarker
              everSet = true unless everSet
              bounds.extend(gMarker.getPosition())
          .then ->
            gMap.fitBounds(bounds) if everSet
]
