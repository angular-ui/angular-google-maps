angular.module('uiGmapgoogle-maps.mocks', ['uiGmapgoogle-maps'])
.factory('GoogleApiMock', ->

  class MockInfoWindow
    constructor: ->
      @_isOpen = false

    open: (map, anchor) =>
      @_isOpen = true
      return

    close: =>
      @_isOpen = false
      return

    isOpen: (val = undefined) ->
      unless val?
        return @_isOpen
      else
        @_isOpen = val

  getMarker = ->
    map = undefined
    Marker = (opts) -> return
    Marker::.setMap = (_map) ->
      map = _map
    Marker::.getMap =  ->
      map
    Marker::.setPosition = (position) ->
    Marker::.setIcon = (icon) ->
    Marker::setVisible = (isVisible) ->
    Marker::setOptions = (options) ->
    return Marker

  getMap = ->
    Map = (opts) -> return
    Map::center =
      lat: -> 0
      lng: -> 0
    Map::controls = {
      TOP_CENTER: [],
      TOP_LEFT: [],
      TOP_RIGHT: [],
      LEFT_TOP: [],
      RIGHT_TOP: [],
      LEFT_CENTER: [],
      RIGHT_CENTER: [],
      LEFT_BOTTOM: [],
      RIGHT_BOTTOM: [],
      BOTTOM_CENTER: [],
      BOTTOM_LEFT: [],
      BOTTOM_RIGHT: []
    }
    Map::overlayMapTypes = new window.google.maps.MVCArray()
    Map::getControls = -> return @controls
    Map::setOpts = -> return
    Map::setOptions = -> return
    Map::setZoom = -> return
    Map::setCenter = -> return
    Map::getCoords = -> return {latitude: 47, longitude: -27} unless Map.getCoords?
    return Map

  class GoogleApiMock
    constructor: ->
      @mocks = [
        @mockAPI
        @mockLatLng
        @mockLatLngBounds
        @mockControlPosition
        @mockAnimation
        @mockMapTypeId
        @mockOverlayView
        @mockOverlayView
        @mockEvent
        @mockInfoWindow
        @mockMarker
        @mockMVCArray
        @mockPoint
        @mockPolygon
        @mockMap
        @mockPlaces
        @mockSearchBox
      ]
      @initAll = -> @mocks.forEach (fn) -> fn?()

    mockAPI: ->
      window.google = {}
      window.google.maps = {}

      # To make debugging easier, mock everything with exceptions
      unmocked = (api) => () => throw new String('Unmocked API ' + api)
      window.google.maps.Marker = unmocked('Marker')
      window.google.maps.event =
        clearListeners: unmocked('event.clearListeners')
        addListener: unmocked('event.addListener')
        removeListener: unmocked('event.removeListener')
      window.google.maps.OverlayView = unmocked('OverlayView')
      window.google.maps.InfoWindow = unmocked('InfoWindow')
      window.google.maps.LatLng = unmocked('LatLng')
      window.google.maps.MVCArray = unmocked('MVCArray')
      window.google.maps.Point = unmocked('Point')
      window.google.maps.LatLngBounds = unmocked('LatLngBounds')

    mockPlaces: ->
      window.google.maps.places = {}

    mockSearchBox: (SearchBox = () -> return) ->
      window.google.maps.places.SearchBox = SearchBox

    #http://gis.stackexchange.com/questions/11626/does-y-mean-latitude-and-x-mean-longitude-in-every-gis-software
    mockLatLng: (LatLng = (y, x) ->
      lat: () ->
        y
      lng: () ->
        x) ->
      window.google.maps.LatLng = LatLng

    mockLatLngBounds: (LatLngBounds = () -> return) ->
      if not (LatLngBounds.extend?)
        LatLngBounds.prototype.extend = () -> return

      window.google.maps.LatLngBounds = LatLngBounds

    # mockMap:(Map = () -> return) ->
    #   @mockMapTypeId()
    #   @mockLatLng()
    #   @mockOverlayView()
    #   @mockEvent()
    #   Map.getCoords = -> return {latitude: 47, longitude: -27} unless Map.getCoords?
    #   window.google.maps.Map = Map
    mockMap: =>
      @mockMapTypeId()
      @mockLatLng()
      @mockOverlayView()
      @mockEvent()
      @mockMVCArray()
      Map = getMap()
      window.google.maps.Map = Map

    mockControlPosition: ->
      ControlPosition =
        TOP_CENTER: 'TOP_CENTER',
        TOP_LEFT: 'TOP_LEFT',
        TOP_RIGHT: 'TOP_RIGHT',
        LEFT_TOP: 'LEFT_TOP',
        RIGHT_TOP: 'RIGHT_TOP',
        LEFT_CENTER: 'LEFT_CENTER',
        RIGHT_CENTER: 'RIGHT_CENTER',
        LEFT_BOTTOM: 'LEFT_BOTTOM',
        RIGHT_BOTTOM: 'RIGHT_BOTTOM',
        BOTTOM_CENTER: 'BOTTOM_CENTER',
        BOTTOM_LEFT: 'BOTTOM_LEFT',
        BOTTOM_RIGHT: 'BOTTOM_RIGHT'
      window.google.maps.ControlPosition = ControlPosition

    mockAnimation: (Animation = {BOUNCE: 'bounce'}) ->
      window.google.maps.Animation = Animation

    mockMapTypeId: (MapTypeId = {ROADMAP: 'roadmap'}) ->
      window.google.maps.MapTypeId = MapTypeId

    mockOverlayView: (OverlayView = class OverlayView
      setMap: () ->) ->
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

        event.addListenerOnce = (thing, eventName, callBack) ->
          callBack() #forcing immediate return for idle so async api kicks off
          event.addListener(thing, eventName, callBack)

      if not event.clearListeners
        event.clearListeners = () ->
          listeners.length = 0

      if not event.removeListener
        event.removeListener = (item) ->
          index = listeners.indexOf(item)
          if index != -1
            listeners.splice(index)

      unless event.fireListener
        event.fireListener = (thing, eventName) =>
          found = _.find listeners, (obj)->
            obj.obj == thing
          found.events[eventName](found.obj) if found?


      window.google.maps.event = event
      return listeners

    mockInfoWindow: (InfoWindow = MockInfoWindow) ->
      window.google.maps.InfoWindow = InfoWindow

    mockMarker: (Marker = getMarker()) ->
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

    mockPoint: (Point = (x, y) -> return {x: x, y: y}) ->
      window.google.maps.Point = Point

    mockPolygon: (polygon) ->
      return window.google.maps.Polygon = polygon if polygon?

      #https://developers.google.com/maps/documentation/javascript/reference#Polygon
      #https://developers.google.com/maps/documentation/javascript/reference#PolygonOptions
      window.google.maps.Polygon = (options) ->
        @getDraggable = ->
          options.draggable
        @getEditable = ->
          options.editable
        @getMap = ->
          options.map
        @getPath = ->
          _.first(options.paths)
        @getPaths = ->
          options.paths
        @getVisible = ->
          options.visible
        @setOptions = (opts) ->
          options = opts

        @setDraggable = (boolean) ->
          options.draggable = boolean
        @setEditable = (boolean) ->
          options.editable = boolean
        @setMap = (map) ->
          options.map = map
        @setPath = (path) ->
          if options.paths? and options.paths.length > 0
            options.paths[0] = path
          else
            options.paths = []
            options.paths.push path

        @setPaths = (paths) ->
          options.paths = paths

        @setVisible = (boolean) ->
          options.visible = boolean
        @

    getMarker: getMarker
    getMap: getMap
  GoogleApiMock
)
