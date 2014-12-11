###
@authors
Nicholas McCready - https://twitter.com/nmccready
Original idea from: http://stackoverflow.com/questions/22758950/google-map-drawing-freehand  , &
  http://jsfiddle.net/YsQdh/88/
###
angular.module('uiGmapgoogle-maps.directives.api.models.child')
.factory 'uiGmapDrawFreeHandChildModel', ['uiGmapLogger', '$q', ($log, $q) ->
  drawFreeHand = (map, polys, done) ->
    poly = new google.maps.Polyline
      map: map
      clickable: false

    move = google.maps.event.addListener map, 'mousemove', (e) ->
      poly.getPath().push e.latLng

    google.maps.event.addListenerOnce map, 'mouseup', (e) ->
      google.maps.event.removeListener move
      path = poly.getPath()
      poly.setMap null
      polys.push new google.maps.Polygon
        map: map
        path: path
      poly = null
      google.maps.event.clearListeners map.getDiv(), 'mousedown'
      done()

    undefined

  freeHandMgr = (@map, scope) ->
    disableMap = =>
      # Whilst drawing, freeze the map (so that mouse "drag" action draws and doesn't move the map).
      mapOptions =
        draggable: false
        disableDefaultUI: true
        scrollwheel: false
        disableDoubleClickZoom: false

      $log.info 'disabling map move'
      @map.setOptions mapOptions

    enableMap = =>
      # After drawing, un-freeze the map.
      mapOptions =
        draggable: true
        disableDefaultUI: false
        scrollwheel: true
        disableDoubleClickZoom: true

      @deferred?.resolve()
      _.defer =>
        @map.setOptions _.extend mapOptions, scope.options

    @engage = (@polys) =>
      @deferred = $q.defer()
      disableMap()
      $log.info 'DrawFreeHandChildModel is engaged (drawing).'
      google.maps.event.addDomListener @map.getDiv(), 'mousedown', (e) =>
        drawFreeHand @map, @polys, enableMap
      @deferred.promise

    this

  freeHandMgr
]
