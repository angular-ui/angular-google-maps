angular.module("google-maps.directives.api".ns())
.factory "Map".ns(), [
  "$timeout", '$q',"Logger".ns(), "GmapUtil".ns(), "BaseObject".ns(),
  "CtrlHandle".ns(), 'IsReady'.ns(), "uuid".ns(),
  "ExtendGWin".ns(),"ExtendMarkerClusterer".ns(),
  "GoogleMapsUtilV3".ns(),'GoogleMapApi'.ns(),
  ($timeout,$q, $log, GmapUtil, BaseObject,
    CtrlHandle, IsReady, uuid,
    ExtendGWin, ExtendMarkerClusterer,
    GoogleMapsUtilV3,GoogleMapApi) ->
        "use strict"
        DEFAULTS = undefined

        initializeItems = [GoogleMapsUtilV3, ExtendGWin, ExtendMarkerClusterer]

        class Map extends BaseObject
            @include GmapUtil
            constructor: ->
                ctrlFn = ($scope) ->
                    retCtrl = undefined
                    $scope.$on '$destroy', ->
                      IsReady.reset()

                    ctrlObj = CtrlHandle.handle $scope
                    $scope.ctrlType = 'Map'
                    $scope.deferred.promise.then ->
                      initializeItems.forEach (i) ->
                        i.init()
                    ctrlObj.getMap = ->
                      $scope.map
                    retCtrl = _.extend @, ctrlObj
                    retCtrl
                @controller = ["$scope", ctrlFn ]
                self = @
            restrict: "EMA"
            transclude: true
            replace: false
            #priority: 100,
            template: '<div class="angular-google-map"><div class="angular-google-map-container"></div><div ng-transclude style="display: none"></div></div>'

            scope:
                center: "=" # required
                zoom: "=" # required
                dragging: "=" # optional
                control: "=" # optional
                options: "=" # optional
                events: "=" # optional
                eventOpts: "=" # optional
                styles: "=" # optional
                bounds: "="

            ###
            @param scope
            @param element
            @param attrs
            ###
            link: (scope, element, attrs) =>
                unless scope.center?
                  unbindCenterWatch = scope.$watch 'center', =>
                    return unless scope.center
                    unbindCenterWatch()
                    @link scope, element, attrs #try again
                  return

                GoogleMapApi.then (maps) =>
                  DEFAULTS = mapTypeId: maps.MapTypeId.ROADMAP
                  spawned = IsReady.spawn()
                  resolveSpawned = =>
                    spawned.deferred.resolve
                      instance: spawned.instance
                      map: _m
                  # Center property must be specified and provide lat &
                  # lng properties
                  if not @validateCoords(scope.center)
                      $log.error "angular-google-maps: could not find a valid center property"
                      return
                  unless angular.isDefined(scope.zoom)
                      $log.error "angular-google-maps: map zoom property not set"
                      return
                  el = angular.element(element)
                  el.addClass "angular-google-map"

                  # Parse options
                  opts =
                      options: {}
                  opts.options = scope.options  if attrs.options

                  opts.styles = scope.styles  if attrs.styles
                  if attrs.type
                      type = attrs.type.toUpperCase()
                      if google.maps.MapTypeId.hasOwnProperty(type)
                          opts.mapTypeId = google.maps.MapTypeId[attrs.type.toUpperCase()]
                      else
                          $log.error "angular-google-maps: invalid map type '#{attrs.type}'"

                  # Create the map
                  mapOptions = angular.extend {}, DEFAULTS, opts,
                    center: @getCoords scope.center
                    zoom: scope.zoom
                    bounds: scope.bounds

                  _m = new google.maps.Map(el.find("div")[1], mapOptions)
                  _m['_id'.ns()] = uuid.generate()

                  dragging = false

                  google.maps.event.addListenerOnce _m, 'idle', ->
                    scope.deferred.resolve _m
                    resolveSpawned()

                  google.maps.event.addListener _m, "dragstart", =>
                      dragging = true
                      @debounceNow  ->
                        scope.$apply (s) ->
                            s.dragging = dragging if s.dragging?

                  google.maps.event.addListener _m, "dragend", =>
                      dragging = false
                      @debounceNow  ->
                        scope.$apply (s) ->
                            s.dragging = dragging if s.dragging?


                  google.maps.event.addListener _m, "drag", =>
                      c = _m.center
                      @debounceNow  ->
                          scope.$apply (s) ->
                              if angular.isDefined(s.center.type)
                                  s.center.coordinates[1] = c.lat()
                                  s.center.coordinates[0] = c.lng()
                              else
                                  s.center.latitude = c.lat()
                                  s.center.longitude = c.lng()
                      , scope.eventOpts?.debounce?.debounce?.dragMs


                  google.maps.event.addListener _m, "zoom_changed", =>
                      if scope.zoom isnt _m.zoom
                          @debounceNow  ->
                              scope.$apply (s) ->
                                  s.zoom = _m.zoom
                          , scope.eventOpts?.debounce?.zoomMs


                  settingCenterFromScope = false
                  google.maps.event.addListener _m, "center_changed", =>
                      c = _m.center
                      return  if settingCenterFromScope #if the scope notified this change then there is no reason to update scope otherwise infinite loop
                      @debounceNow  ->
                          scope.$apply (s) ->
                              unless _m.dragging
                                  if angular.isDefined(s.center.type)
                                      s.center.coordinates[1] = c.lat() if s.center.coordinates[1] isnt c.lat()
                                      s.center.coordinates[0] = c.lng() if s.center.coordinates[0] isnt c.lng()
                                  else
                                      s.center.latitude = c.lat()  if s.center.latitude isnt c.lat()
                                      s.center.longitude = c.lng()  if s.center.longitude isnt c.lng()
                      , scope.eventOpts?.debounce?.centerMs


                  google.maps.event.addListener _m, "idle", =>
                      b = _m.getBounds()
                      ne = b.getNorthEast()
                      sw = b.getSouthWest()
                      @debounceNow  ->
                          scope.$apply (s) ->
                              if s.bounds isnt null and s.bounds isnt `undefined` and s.bounds isnt undefined
                                  s.bounds.northeast =
                                      latitude: ne.lat()
                                      longitude: ne.lng()

                                  s.bounds.southwest =
                                      latitude: sw.lat()
                                      longitude: sw.lng()

                  if angular.isDefined(scope.events) and scope.events isnt null and angular.isObject(scope.events)
                      getEventHandler = (eventName) ->
                          ->
                              scope.events[eventName].apply scope, [_m, eventName, arguments]

                      #TODO: Need to keep track of listeners and call removeListener on each
                      for eventName of scope.events
                          google.maps.event.addListener _m, eventName, getEventHandler(eventName)  if scope.events.hasOwnProperty(eventName) and angular.isFunction(scope.events[eventName])

                  # Put the map into the scope
                  # free-draw-polygons depends on this
                  _m.getOptions = ->
                    mapOptions
                  scope.map = _m

                  # check if have an external control hook to direct us manually without watches
                  # this will normally be an empty object that we extend and slap functionality
                  # onto with this directive
                  if attrs.control? and scope.control?
                      scope.control.refresh = (maybeCoords) =>
                          return unless _m?
                          google.maps.event.trigger _m, "resize" #actually refresh
                          if maybeCoords?.latitude? and maybeCoords?.latitude?
                              coords = @getCoords(maybeCoords)
                              if @isTrue(attrs.pan)
                                  _m.panTo coords
                              else
                                  _m.setCenter coords

                      scope.control.getGMap = ()=>
                          _m
                      scope.control.getMapOptions = ->
                        mapOptions

                  # Update map when center coordinates change
                  scope.$watch "center", ((newValue, oldValue) =>
                      coords = @getCoords newValue
                      return  if coords.lat() is _m.center.lat() and coords.lng() is _m.center.lng()
                      settingCenterFromScope = true
                      unless dragging
                          if !@validateCoords(newValue)
                              $log.error("Invalid center for newValue: #{JSON.stringify newValue}")
                          if @isTrue(attrs.pan) and scope.zoom is _m.zoom
                              _m.panTo coords
                          else
                              _m.setCenter coords

                      settingCenterFromScope = false
                  ), true
                  scope.$watch "zoom", (newValue, oldValue) =>
                      return  if _.isEqual(newValue,oldValue)
                      @debounceNow  ->
                          _m.setZoom newValue

                  scope.$watch "bounds", (newValue, oldValue) ->
                      return  if newValue is oldValue
                      if !newValue.northeast.latitude? or !newValue.northeast.longitude? or !newValue.southwest.latitude? or !newValue.southwest.longitude?
                          $log.error "Invalid map bounds for new value: #{JSON.stringify newValue}"
                          return
                      ne = new google.maps.LatLng(newValue.northeast.latitude, newValue.northeast.longitude)
                      sw = new google.maps.LatLng(newValue.southwest.latitude, newValue.southwest.longitude)
                      bounds = new google.maps.LatLngBounds(sw, ne)
                      _m.fitBounds bounds

                  ['options','styles'].forEach (toWatch) ->
                    scope.$watch toWatch, (newValue,oldValue) ->
                      watchItem = @exp
                      return  if _.isEqual(newValue,oldValue)
                      opts.options = newValue
                      _m.setOptions opts  if _m?
                  ,true
    ]
