###
@authors
Nicholas McCready - https://twitter.com/nmccready
Original idea from: http://stackoverflow.com/questions/22758950/google-map-drawing-freehand  , &
  http://jsfiddle.net/YsQdh/88/
###
angular.module('uiGmapgoogle-maps.directives.api.models.child')
.factory 'uiGmapDrawFreeHandChildModel', ['uiGmapLogger', '$q', ($log, $q) ->
  drawFreeHand = (map, polys, enable) ->
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
      enable()

    undefined

  freeHandMgr = (@map, defaultOptions) ->
    unless defaultOptions
      defaultOptions =
        draggable: true
        zoomControl: true
        scrollwheel: true
        disableDoubleClickZoom: true
    #freeze map to make drawing easy (need to drag to draw .. instead of moving the map)
    enable = =>
      @deferred?.resolve()
      _.defer =>
        @map.setOptions _.extend @oldOptions, defaultOptions

    disableMap = =>
      $log.info 'disabling map move'
      @oldOptions = map.getOptions()
      @oldOptions.center = map.getCenter()

      @map.setOptions
        draggable: false
        zoomControl: false
        scrollwheel: false
        disableDoubleClickZoom: false

    @engage = (@polys) =>
      @deferred = $q.defer()
      disableMap()
      $log.info 'DrawFreeHandChildModel is engaged (drawing).'
      google.maps.event.addDomListener @map.getDiv(), 'mousedown', (e) =>
        drawFreeHand @map, @polys, enable
      @deferred.promise

    this

  freeHandMgr
]
