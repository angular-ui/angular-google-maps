###
angular-google-maps
https://github.com/nlaplante/angular-google-maps

@authors
Nicholas McCready - https://twitter.com/nmccready
Original idea from: http://stackoverflow.com/questions/22758950/google-map-drawing-freehand  , &
  http://jsfiddle.net/YsQdh/88/
###
angular.module("google-maps")
.directive "FreeDrawPolygons", ["$log", "BaseObject", "CtrlHandle", "Logger", (BaseObject, CtrlHandle, $log) ->
  drawFreeHand = (@map)->
    @polys = []
    #the polygon
    poly = new google.maps.Polyline
      map: @map
      clickable: false

    #move-listener
    move = google.maps.event.addListener @map, "mousemove", (e) ->
      poly.getPath().push e.latLng

    #mouseup-listener
    google.maps.event.addListenerOnce map, "mouseup", (e) =>
      google.maps.event.removeListener move
      path = poly.getPath()
      poly.setMap null
      @polys.push new google.maps.Polygon
        map: @map
        path: path
      poly = null
      google.maps.event.clearListeners @map.getDiv(), "mousedown"
      @enable()

    @engage = =>
      $log.info("draws");
      @disableMap()
      google.maps.event.addDomListener @map.getDiv(), 'mousedown', (e) ->
        drawFreeHand()

    #freeze map to make drawing eays
    @disableMap = ->
      @oldOptions = @map.getOptions()
      @map.setOptions
        draggable: false
        zoomControl: false
        scrollwheel: false
        disableDoubleClickZoom: false
    #set map back to old setting
    @enable = ->
      @map.setOptions @oldOptions
    return @


  class FreeDrawPolygons extends BaseObject
    @include CtrlHandle
    restrict: "EA"
    replace: true
    require: "^googleMap"
    scope:
      polygons: "="
      options: "="
      events: "="

    link: (scope, element, attrs, mapCtrl) ->
      @mapPromise(scope, ctrl).then (map) =>
        drawFreeHand map

  new FreeDrawPolygons()
]
