angular.module("google-maps.mocks", [])
.factory "GoogleApiMock", ->
  class _Map
    constructor:()->
      @lat = 47
      @lon = -27
      @zoom = 0
      @getCoords = -> return {latitude: @lat, longitude: @lon}
      @center = new window.google.maps.LatLng @lat,@lon
      @setCenter = (coords) =>
        @center = coords
      @setZoom = (@zoom) ->
  class GoogleApiMock
    constructor: ->
    mockAPI: ->
      window.google = {}
      window.google.maps = {}

      # To make debugging easier, mock everything with exceptions
      unmocked = (api) => () => throw new String("Unmocked API " + api)
      window.google.maps.Marker = unmocked("Marker")
      window.google.maps.event =
        clearListeners: unmocked("event.clearListeners")
        addListener: unmocked("event.addListener")
      window.google.maps.OverlayView = unmocked("OverlayView")
      window.google.maps.InfoWindow = unmocked("InfoWindow")
      window.google.maps.LatLng = unmocked("LatLng")
      window.google.maps.MVCArray = unmocked("MVCArray")
      window.google.maps.Point = unmocked("Point")
      window.google.maps.LatLngBounds = unmocked("LatLngBounds")

    #http://gis.stackexchange.com/questions/11626/does-y-mean-latitude-and-x-mean-longitude-in-every-gis-software
    mockLatLng: (LatLng = (y, x) ->
      lat: () ->
        y
      lng: () ->
        x
    ) ->
      window.google.maps.LatLng = LatLng

    mockLatLngBounds: (LatLngBounds = () -> return) ->
      if not (LatLngBounds.extend?)
        LatLngBounds.prototype.extend = () -> return

      window.google.maps.LatLngBounds = LatLngBounds

    mockMap:(map) ->
      @mockMapTypeId()
      @mockLatLng()
      @mockOverlayView()
      @mockEvent()
      map = _Map unless map
      window.google.maps.Map = map

    mockAnimation: (Animation = {BOUNCE: "bounce"}) ->
      window.google.maps.Animation = Animation

    mockMapTypeId: (MapTypeId = {ROADMAP: "roadmap"}) ->
      window.google.maps.MapTypeId = MapTypeId

    mockOverlayView: (
      OverlayView = class OverlayView
        setMap:() ->
    ) ->
      window.google.maps.OverlayView = OverlayView

    mockEvent: (event = {}) ->
      listeners = []
      #mocking google maps event listener
      if not event.addListener
        event.addListener = (thing, eventName, callBack) ->
          found = _.find listeners, (obj)->
            obj.obj == thing
            unless found?
              toPush = {}
              toPush.obj = thing
              toPush.events = {}
              toPush.events[eventName] = callBack
              listeners.push toPush
            else
              found.events[eventName] = callBack

      if not event.clearListeners
        event.clearListeners = () ->
          listeners.length = 0

      unless event.fireListener
        event.fireListener = (thing, eventName) =>
          found = _.find listeners, (obj)->
            obj.obj == thing
          found.events[eventName](found.obj) if found?


      window.google.maps.event = event

    mockInfoWindow: (InfoWindow = () -> return) ->
      window.google.maps.InfoWindow = InfoWindow

    mockMarker: (Marker = @getMarker()) ->
      window.google.maps.Marker = Marker

    mockMVCArray: () ->
      MVCArray = () ->
        this.values = []
        return

      if not (MVCArray.getLength?)
        MVCArray.prototype.getLength = () ->
          return this.values.length

      if not (MVCArray.push?)
        MVCArray.prototype.push = (value) ->
          this.values.push(value)

      window.google.maps.MVCArray = MVCArray

    mockPoint: (Point = (x,y) -> return {x: x, y:y}) ->
      window.google.maps.Point = Point

    getMarker: ->
      Marker = (opts) -> return
      Marker.prototype.setMap = (map) ->
        return

      return Marker

  GoogleApiMock

