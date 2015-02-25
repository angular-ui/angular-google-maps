capitalize = (s) ->
  return s[0].toUpperCase() + s.slice(1)

angular.module('uiGmapgoogle-maps.mocks', ['uiGmapgoogle-maps'])
.factory('GoogleApiMock', ->
  class MapObject
    getMap: =>
      @map
    setMap: (m) =>
      @map = m
    setOptions: (o)=>
      @opts = o

  class DraggableObject extends MapObject
    setDraggable: (bool)=>
      @draggable = bool
    getDraggable: =>
      @draggable

  class VisibleObject extends MapObject
    setVisible: (bool) =>
      @visible = bool
    getVisible: =>
      @visible

  class PositionObject extends MapObject
    setPosition:(position) =>
      @position
    getPosition: =>
      @position

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

    setContent: (content) =>
      @content = content

    getContent: =>
      @content

  getLatLng = ->
    class LatLng
      constructor: (@y,@x, nowrap) ->
      lat: =>
        @y
      lng: =>
        @x

  getMarker = ->
    class Marker extends MapObject
      _.extend @::, PositionObject::, DraggableObject::, VisibleObject::
      @instances = 0
      @resetInstances = =>
        @instances = 0
      @creationSubscribe = (obj, cb) ->
        window.google.maps.event.addListener(obj, 'creation', cb)
      @creationUnSubscribe = (listener) ->
        window.google.maps.event.removeListener listener

      constructor: (opts) ->
        super()
        if opts?
          ['draggable', 'editable',
          'map','visible', 'position'].forEach (o) =>
            @[o] = opts[o]
        Marker.instances += 1
        if window?.google?.maps?.event?
          window.google.maps.event.fireAllListeners 'creation', @

      setOptions: (o)=>
        super(o)
        if o?.position?
          @position = o.position
      setAnimation:(obj) =>
        @animation = obj
      getAnimation: =>
        @animation
      setIcon: (icon) =>
        @icon
      getIcon: =>
        @icon
      setClickable: (bool) =>
        @clickable = bool
      getClickable: =>
        @clickable
      setZIndex:(z) =>
        @zIndex = z
      getZIndex: =>
        @zIndex
      setTitle: (str) =>
        @title = str
      getTitle: =>
        @title
      setOpacity: (num) =>
        @opacity = num
      getOpacity: =>
        @opacity

  getCircle = ->
    class Circle extends MapObject
      _.extend @::, DraggableObject::, VisibleObject::
      @instances = 0
      @resetInstances = =>
        @instances = 0
      @creationSubscribe = (obj, cb) ->
        window.google.maps.event.addListener(obj, 'creation', cb)
      @creationUnSubscribe = (listener) ->
        window.google.maps.event.removeListener listener

      constructor: (opts) ->
        super()
        @props= ['draggable', 'editable', 'map','visible', 'radius', 'center']
        @setOptions opts

        Circle.instances += 1
        if window?.google?.maps?.event?
          window.google.maps.event.fireAllListeners 'creation', @

        #getters
        @props.forEach (p) =>
          @["get#{capitalize p}"] = =>
            @[p]

        #setters
        @props.forEach (p) =>
          @["set#{capitalize p}"] = (val) =>
            @[p] = val

      setOptions: (o)=>
        super(o)
        _.extend @, o



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
    Map::getBounds = ->
      unless Map.getBounds?
        getNorthEast: ->
          google.maps.LatLng(47,27)
        getSouthWest: ->
          google.maps.LatLng(89,100)
    return Map


  getMarkerWithLabel: ->
    class MarkerWithLabel extends getMarker()
      @instances = 0
      @resetInstances = =>
        @instances = 0
      constructor: (opts) ->
        if opts?
          ['draggable', 'editable', 'map','path', 'visible'].forEach (o) =>
            @[o] = opts[o]
        @drawn = false
        MarkerWithLabel.instances += 1

      setAnchor: (anchor) =>
        @anchor = @anchor
      getAnchor: =>
        @anchor
      setMandatoryStyles: (obj) =>
        @mandatoryStyles = obj
      getMandatoryStyles: =>
        @mandatoryStyles
      setStyles:(obj) =>
        @styles = obj
      getStyles: =>
        @styles
      setContent:(content) =>
        @content = content
      getContent: =>
        @content
      draw: =>
        @drawn = true
      onRemove: =>
      onAdd: =>

  getPolyline = ->
    class Polyline extends DraggableObject
      @instances = 0
      @resetInstances = =>
        @instances = 0
      constructor: (opts) ->
        if opts?
          ['draggable', 'editable', 'map','path', 'visible'].forEach (o) =>
            @[o] = opts[o]
        Polyline.instances += 1

      getEditable: =>
        @editable
      getPath: =>
        @path
      setEditable: (bool)=>
        @editable = bool
      setPath: (array)=>
        @path = array

  getMVCArray = ->
    class MVCArray extends Array
      @instances = 0
      @resetInstances = =>
        @instances = 0
      constructor: ->
        MVCArray.instances += 1
        super()
      clear: ->
        @length = 0
      getArray: =>
        @
      getAt:(i) =>
        @[i]
      getLength: =>
        @length
      insertAt:(i, elem) =>
        @splice(i, 0, elem)
      removeAt:(i) ->
        @splice(i,1)
      setAt:(i, elem) ->
        @[i] = elem

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
        @mockCircle
        @mockMVCArray
        @mockPoint
        @mockPolygon
        @mockPolyline
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
      window.google.maps.Polyline = unmocked('Polyline')

    mockPlaces: ->
      window.google.maps.places = {}

    mockSearchBox: (SearchBox = () -> return) ->
      window.google.maps.places.SearchBox = SearchBox

    mockLatLng: (yours) ->
      window.google.maps.LatLng = unless yours then getLatLng() else yours

    mockLatLngBounds: (LatLngBounds = () -> return) ->
      if not (LatLngBounds.extend?)
        LatLngBounds.prototype.extend = () -> return

      window.google.maps.LatLngBounds = LatLngBounds

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
        event.fireListener = (thing, eventName) ->
          found = _.find listeners, (obj)->
            obj.obj == thing
          found.events[eventName](found.obj) if found? and found?.events[eventName]?

      unless event.normalizedEvents
        event.normalizedEvents = ->
          ret = _ listeners.map (obj) ->
            _.keys(obj.events)
          .chain()
          .flatten()
          .uniq()
          .value()
          ret

      unless event.fireAllListeners
        event.fireAllListeners = (eventName, state) ->
          listeners.forEach (obj)->
            if obj.events[eventName]?
              obj.events[eventName](state)

      window.google.maps.event = event
      return listeners

    mockInfoWindow: (InfoWindow = MockInfoWindow) ->
      window.google.maps.InfoWindow = InfoWindow

    mockMarker: (Marker = getMarker()) ->
      window.google.maps.Marker = Marker

    mockMVCArray: (impl = getMVCArray()) ->
      window.google.maps.MVCArray = impl

    mockCircle: (Circle = getCircle())->
      window.google.maps.Circle = Circle

    mockPoint: (Point = (x, y) -> return {x: x, y: y}) ->
      window.google.maps.Point = Point

    mockPolyline: (impl = getPolyline()) ->
      return window.google.maps.Polyline = impl

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
    getPolyline: getPolyline
    getMVCArray: getMVCArray
    getLatLng: getLatLng
  GoogleApiMock
)
