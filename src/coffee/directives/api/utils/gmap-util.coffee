angular.module("google-maps.directives.api.utils".ns())
.service "GmapUtil".ns(), ["Logger".ns(), "$compile", (Logger, $compile) ->
  DEFAULT_EVENT_OPTS =
    debounceMs: 5
  #BEGIN Private Methods
  debounce = (fn, delay = DEFAULT_EVENT_OPTS.debounceMs) ->
    # true in debounce is the key to making the function execute on this iteration w/ a delay
    _.debounce  fn , delay, true

  getLatitude = (value) ->
    if Array.isArray(value) and value.length is 2
      value[1]
    else if angular.isDefined(value.type) and value.type is "Point"
      value.coordinates[1]
    else
      value.latitude

  getLongitude = (value) ->
    if Array.isArray(value) and value.length is 2
      value[0]
    else if angular.isDefined(value.type) and value.type is "Point"
      value.coordinates[0]
    else
      value.longitude

  getCoords = (value) ->
    return unless value
    if Array.isArray(value) and value.length is 2
      new google.maps.LatLng(value[1], value[0])
    else if angular.isDefined(value.type) and value.type is "Point"
      new google.maps.LatLng(value.coordinates[1], value.coordinates[0])
    else
      new google.maps.LatLng(value.latitude, value.longitude)

  validateCoords = (coords) ->
    return false if angular.isUndefined coords

    if _.isArray(coords)
      return true if coords.length is 2
    else if coords? and coords?.type
      return true if coords.type is "Point" and _.isArray(coords.coordinates) and coords.coordinates.length is 2
    return true if coords and angular.isDefined coords?.latitude and angular.isDefined coords?.longitude
    false
  #END Private Methods

  # BEGIN Public Methods
  setCoordsFromEvent: (prevValue, newLatLon) ->
    return unless prevValue
    if Array.isArray(prevValue) and prevValue.length is 2
      prevValue[1] = newLatLon.lat()
      prevValue[0] = newLatLon.lng()
    else if angular.isDefined(prevValue.type) and prevValue.type is "Point"
      prevValue.coordinates[1] = newLatLon.lat()
      prevValue.coordinates[0] = newLatLon.lng()
    else
      prevValue.latitude = newLatLon.lat()
      prevValue.longitude = newLatLon.lng()

    prevValue

  getLabelPositionPoint: (anchor) ->
    if anchor == undefined
      return undefined

    anchor = /^([-\d\.]+)\s([-\d\.]+)$/.exec(anchor)
    xPos = parseFloat(anchor[1])
    yPos = parseFloat(anchor[2])
    if xPos? && yPos?
      new google.maps.Point(xPos, yPos)

  createWindowOptions: (gMarker, scope, content, defaults) ->
    if content? and defaults? and $compile?
      options = angular.extend {}, defaults,
        content: @buildContent(scope, defaults, content),
        position: if defaults.position?
        then defaults.position else if angular.isObject(gMarker)
        then gMarker.getPosition() else getCoords(scope.coords)
      if gMarker? and !options?.pixelOffset?
        #if we have a marker, center the window above
        if !options.boxClass?
          # options.pixelOffset = height:-40, width:0 (using anchor)
        else #it is an infoBox center it below
          options.pixelOffset = height:0, width:-2
      options
    else
      unless defaults
        Logger.error "infoWindow defaults not defined"
        Logger.error "infoWindow content not defined" unless content
      else
        return defaults

  buildContent: (scope, defaults, content) ->
    if defaults.content?
      ret = defaults.content
    else
      if $compile?
        parsed = $compile(content)(scope)
        if parsed.length > 0
          ret = parsed[0] #must be one element with children or angular bindings get lost
      else
        ret = content
    ret

  defaultDelay: 50

  isTrue: (val) ->
    angular.isDefined(val) and val isnt null and val is true or val is "1" or val is "y" or val is "true"

  isFalse: (value) ->
    ['false', 'FALSE', 0, 'n', 'N', 'no', 'NO'].indexOf(value) != -1

  getCoords: getCoords

  validateCoords: validateCoords

  equalCoords: (coord1, coord2) ->
    getLatitude(coord1) == getLatitude(coord2) and
      getLongitude(coord1) == getLongitude(coord2)

  validatePath: (path) ->
    i = 0
    if angular.isUndefined(path.type)
      if not Array.isArray(path) or path.length < 2
        return false

      #Arrays of latitude/longitude objects or Google Maps LatLng objects are allowed
      while i < path.length
        if not ((angular.isDefined(path[i].latitude) and angular.isDefined(path[i].longitude)) or (typeof path[i].lat == "function" and typeof path[i].lng == "function"))
          return false

        i++

      true
    else
      return false if angular.isUndefined(path.coordinates)

      if path.type is "Polygon"
        return false if path.coordinates[0].length < 4
        #Note: At this time, we only support the outer polygon and ignore the inner 'holes'
        array = path.coordinates[0]
      else if path.type is "MultiPolygon"
        #Note: At this time, we will display the polygon with the most vertices
        trackMaxVertices = { max: 0, index: 0 }
        _.forEach(path.coordinates, (polygon, index) ->
          if polygon[0].length > this.max
            this.max = polygon[0].length
            this.index = index
        , trackMaxVertices);

        #TODO: Properly support MultiPolygons
        polygon = path.coordinates[trackMaxVertices.index]
        #Note: At this time, we only support the outer polygon and ignore the inner 'holes'
        array = polygon[0]

        return false if array.length < 4
      else if path.type is "LineString"
        return false if path.coordinates.length < 2
        array = path.coordinates
      else
        return false

      while i < array.length
        return false if array[i].length != 2
        i++

      true

  convertPathPoints: (path) ->
    i = 0
    result = new google.maps.MVCArray()

    if angular.isUndefined(path.type)
      # TODO: optimize to detect if array contains LatLng and directly pass array to MVCArray constructor
      # CONTRIBUTIONS WELCOMED
      # TODO: remove while loop it is the same as maping, either array.map or _.map
      while i < path.length
        latlng
        if angular.isDefined(path[i].latitude) and angular.isDefined(path[i].longitude) # latitude/longitude object
          latlng = new google.maps.LatLng(path[i].latitude, path[i].longitude)
        else if typeof path[i].lat == "function" and typeof path[i].lng == "function" # LatLng object
          latlng = path[i]

        result.push latlng
        i++
    else
      array
      if path.type is "Polygon"
        #Note: At this time, we only support the outer polygon and ignore the inner 'holes'
        array = path.coordinates[0]
      else if path.type is "MultiPolygon"
        #Note: At this time we will display the polygon with the most vertices
        trackMaxVertices = { max: 0, index: 0 }
        _.forEach(path.coordinates, (polygon, index) ->
          if polygon[0].length > this.max
            this.max = polygon[0].length
            this.index = index
        , trackMaxVertices);

        #TODO: Properly support MultiPolygons
        array = path.coordinates[trackMaxVertices.index][0]
      else if path.type is "LineString"
        array = path.coordinates

      while i < array.length
        result.push new google.maps.LatLng(array[i][1], array[i][0])
        i++

    result

  extendMapBounds: (map, points) ->
    bounds = new google.maps.LatLngBounds()
    i = 0

    while i < points.length
      bounds.extend points.getAt(i)
      i++
    map.fitBounds bounds

  getPath: (object, key) ->
    obj = object
    _.each key.split("."), (value) ->
      if obj then obj = obj[value]

    obj

  validateBoundPoints: (bounds) ->
    return false if angular.isUndefined(bounds.sw.latitude) or
      angular.isUndefined(bounds.sw.longitude) or
      angular.isUndefined(bounds.ne.latitude) or
        angular.isUndefined(bounds.ne.longitude)
    true

  convertBoundPoints: (bounds) ->
    result = new google.maps.LatLngBounds new google.maps.LatLng(bounds.sw.latitude, bounds.sw.longitude)
      ,new google.maps.LatLng(bounds.ne.latitude, bounds.ne.longitude)
    result

  fitMapBounds: (map, bounds) ->
    map.fitBounds bounds


  debounce: debounce

  debounceNow:(fn, delay = DEFAULT_EVENT_OPTS.debounceMs) ->
    debounce(fn, delay = DEFAULT_EVENT_OPTS.debounceMs)()
  #end Public Methods
]
