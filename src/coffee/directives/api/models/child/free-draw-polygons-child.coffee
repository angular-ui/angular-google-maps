###
angular-google-maps
https://github.com/nlaplante/angular-google-maps

@authors
Nicholas McCready - https://twitter.com/nmccready
Original idea from: http://stackoverflow.com/questions/22758950/google-map-drawing-freehand  , &
  http://jsfiddle.net/YsQdh/88/
###
angular.module("google-maps.directives.api.models.child")
.factory "DrawFreeHandChildModel", ['Logger', '$q', ($log,$q) ->
  drawFreeHand = (map, @polys, enable) ->
    #the polygon
    poly = new google.maps.Polyline
      map: map
      clickable: false

    #move-listener
    move = google.maps.event.addListener map, 'mousemove', (e) ->
      poly.getPath().push e.latLng

    #mouseup-listener
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

  freeHandMgr = (@map) ->
    #freeze map to make drawing easy (need to drag to draw .. instead of moving the map)
    enable = =>
      @deferred?.resolve()
      #set map back to old setting
      @map.setOptions @oldOptions

    disableMap = =>
      $log.info('disabling map move');
      @oldOptions = map.getOptions() #dependent on ngmap-map extension
      @map.setOptions
        draggable: false
        zoomControl: false
        scrollwheel: false
        disableDoubleClickZoom: false

    @engage = (@polys) =>
      @deferred = $q.defer()
      disableMap()
      $log.info('DrawFreeHandChildModel is engaged (drawing).');
      google.maps.event.addDomListener @map.getDiv(), 'mousedown', (e) =>
        drawFreeHand @map, @polys, enable
      @deferred.promise
    return @
  freeHandMgr
]