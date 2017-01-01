###globals angular,_,google###
angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapMap',
  ($timeout,$q, $log, uiGmapGmapUtil, uiGmapBaseObject,
    uiGmapCtrlHandle, uiGmapIsReady, uiGmapuuid,
    uiGmapExtendGWin, uiGmapExtendMarkerClusterer,
    uiGmapGoogleMapsUtilV3,uiGmapGoogleMapApi,
    uiGmapEventsHelper, uiGmapGoogleMapObjectManager) ->

      DEFAULTS = undefined

      initializeItems = [uiGmapGoogleMapsUtilV3, uiGmapExtendGWin, uiGmapExtendMarkerClusterer]

      class Map extends uiGmapBaseObject
        @include uiGmapGmapUtil
        constructor: ->
          ctrlFn = ($scope) ->
            retCtrl = undefined
            $scope.$on '$destroy', ->
              uiGmapIsReady.decrement()

            ctrlObj = uiGmapCtrlHandle.handle $scope
            $scope.ctrlType = 'Map'
            $scope.deferred.promise.then ->
              initializeItems.forEach (i) ->
                i.init()
            ctrlObj.getMap = ->
              $scope.map
            retCtrl = _.extend @, ctrlObj
            retCtrl
          @controller = ['$scope', ctrlFn ]

        restrict: 'EMA'
        transclude: true
        replace: false
        #priority: 100,
        template: """
          <div class="angular-google-map"><div class="angular-google-map-container">
          </div><div ng-transclude style="display: none"></div></div>"""

        scope:
          center: '=' # either bounds or center is required
          zoom: '=' # optional
          dragging: '=' # optional
          control: '=' # optional
          options: '=' # optional
          events: '=' # optional
          eventOpts: '=' # optional
          styles: '=' # optional
          bounds: '=' # either bounds or center is required
          update: '=' # optional

        link: (scope, element, attrs) =>
          listeners = []
          scope.$on '$destroy', ->
            uiGmapEventsHelper.removeEvents listeners
            if attrs.recycleMapInstance == 'true' && scope.map
              uiGmapGoogleMapObjectManager.recycleMapInstance(scope.map)
              scope.map = null

          scope.idleAndZoomChanged = false

          uiGmapGoogleMapApi.then (maps) =>
            DEFAULTS = mapTypeId: maps.MapTypeId.ROADMAP
            spawned = uiGmapIsReady.spawn()
            resolveSpawned = ->
              spawned.deferred.resolve
                instance: spawned.instance
                map: _gMap

            # Either a center or bounds lat/long property must be specified
            if not angular.isDefined(scope.center) and not angular.isDefined(scope.bounds)
              $log.error 'angular-google-maps: a center or bounds property is required'
              return

            # If center is not set, calculate the center point from bounds
            if !angular.isDefined(scope.center)
              scope.center = new google.maps.LatLngBounds(@getCoords(scope.bounds.southwest),
                @getCoords(scope.bounds.northeast)).getCenter()

            # If zoom is not set, use a default value
            unless angular.isDefined(scope.zoom)
              scope.zoom = 10

            el = angular.element(element)
            el.addClass 'angular-google-map'

            # Parse options
            opts =
              options: {}
            opts.options = scope.options if attrs.options

            opts.styles = scope.styles if attrs.styles
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

            if attrs.recycleMapInstance == 'true'
              _gMap = uiGmapGoogleMapObjectManager.createMapInstance(el.find('div')[1], mapOptions)
            else
              _gMap = new google.maps.Map(el.find('div')[1], mapOptions)
            _gMap['uiGmap_id'] = uiGmapuuid.generate()

            dragging = false

            listeners.push google.maps.event.addListenerOnce _gMap, 'idle', ->
              scope.deferred.resolve _gMap
              resolveSpawned()

            disabledEvents =
              if attrs.events and scope.events?.blacklist?
                scope.events.blacklist
              else []
            if _.isString disabledEvents
              disabledEvents = [disabledEvents]

            maybeHookToEvent = (eventName, fn, prefn) ->
              unless _.includes disabledEvents, eventName
                prefn() if prefn
                listeners.push google.maps.event.addListener _gMap, eventName, ->
                  unless scope.update?.lazy
                    fn()

            unless _.includes disabledEvents, 'all'
              maybeHookToEvent 'dragstart', ->
                dragging = true
                scope.$evalAsync (s) ->
                  s.dragging = dragging if s.dragging?

              maybeHookToEvent 'dragend', ->
                dragging = false
                scope.$evalAsync (s) ->
                  s.dragging = dragging if s.dragging?

              updateCenter = (c = _gMap.center, s = scope) ->
                unless _.includes disabledEvents, 'center'
                  cLat = c.lat()
                  cLng = c.lng()
                  if angular.isDefined(s.center.type)
                    s.center.coordinates[1] = cLat if s.center.coordinates[1] isnt cLat
                    s.center.coordinates[0] = cLng if s.center.coordinates[0] isnt cLng
                  else
                    s.center.latitude = cLat if s.center.latitude isnt cLat
                    s.center.longitude = cLng if s.center.longitude isnt cLng

              settingFromDirective = false
              maybeHookToEvent 'idle', ->
                b = _gMap.getBounds()
                ne = b.getNorthEast()
                sw = b.getSouthWest()

                settingFromDirective = true
                scope.$evalAsync (s) ->

                  updateCenter()

                  if !_.isUndefined(s.bounds) and !_.includes(disabledEvents, 'bounds')
                    s.bounds.northeast =
                      latitude: ne.lat()
                      longitude: ne.lng()

                    s.bounds.southwest =
                      latitude: sw.lat()
                      longitude: sw.lng()

                  if not _.includes(disabledEvents, 'zoom')
                    s.zoom = _gMap.zoom
                    scope.idleAndZoomChanged = !scope.idleAndZoomChanged
                  settingFromDirective = false

            if angular.isDefined(scope.events) and scope.events isnt null and angular.isObject(scope.events)
              getEventHandler = (eventName) ->
                -> scope.events[eventName].apply scope, [_gMap, eventName, arguments]

              customListeners = []
              for eventName of scope.events
                if scope.events.hasOwnProperty(eventName) and angular.isFunction(scope.events[eventName])
                  customListeners.push google.maps.event.addListener _gMap, eventName, getEventHandler(eventName)
              listeners.concat customListeners

            # Put the map into the scope
            # free-draw-polygons depends on this
            #possibly risky, but this adds the original options to be accessible
            #if we end up watching options this should be updated (appears to be free-draw only this should probably go away)
            _gMap.getOptions = ->
              mapOptions
            scope.map = _gMap

            # check if have an external control hook to direct us manually without watches
            # this will normally be an empty object that we extend and slap functionality
            # onto with this directive
            if attrs.control? and scope.control?
              scope.control.refresh = (maybeCoords) =>
                return unless _gMap?
                if google?.maps?.event?.trigger? and _gMap?
                  google.maps.event.trigger _gMap, 'resize' #actually refresh
                if maybeCoords?.latitude? and maybeCoords?.longitude?
                  coords = @getCoords(maybeCoords)
                  if @isTrue(attrs.pan)
                    _gMap.panTo coords
                  else
                    _gMap.setCenter coords

              scope.control.getGMap = ->
                _gMap
              scope.control.getMapOptions = ->
                mapOptions
              #make customListeners available so a user can de-register the ones they want
              #they can map / trim this list and hand it back to us
              scope.control.getCustomEventListeners = ->
                customListeners
              scope.control.removeEvents = (yourListeners) ->
                uiGmapEventsHelper.removeEvents(yourListeners)

            #UPDATES / SETS FROM CONTROLLER TO COMMAND DIRECTIVE
            #TODO: These watches could potentially be removed infavor of using control only
            # Update map when center coordinates change
            scope.$watch 'center', (newValue, oldValue) =>
              return if newValue == oldValue or settingFromDirective
              coords = @getCoords scope.center #get scope.center to make sure that newValue is not behind
              return if coords.lat() is _gMap.center.lat() and coords.lng() is _gMap.center.lng()

              unless dragging
                if !@validateCoords(newValue)
                  $log.error("Invalid center for newValue: #{JSON.stringify newValue}")
                if @isTrue(attrs.pan) and scope.zoom is _gMap.zoom
                  _gMap.panTo coords
                else
                  _gMap.setCenter coords
            , true

            zoomPromise = null
            scope.$watch 'zoom', (newValue, oldValue) ->
              return unless newValue?
              return if _.isEqual(newValue,oldValue) or _gMap?.getZoom() == scope?.zoom or settingFromDirective
              #make this time out longer than zoom_changes because zoom_changed should be done first
              #being done first should make scopes equal
              $timeout.cancel(zoomPromise) if zoomPromise?
              zoomPromise = $timeout ->
                _gMap.setZoom newValue
              , scope.eventOpts?.debounce?.zoomMs + 20
              , false

            scope.$watch 'bounds', (newValue, oldValue) ->
              return if newValue is oldValue
              if !newValue?.northeast?.latitude? or !newValue?.northeast?.longitude? or
                !newValue?.southwest?.latitude? or !newValue?.southwest?.longitude?
                  $log.error "Invalid map bounds for new value: #{JSON.stringify newValue}"
                  return
              ne = new google.maps.LatLng(newValue.northeast.latitude, newValue.northeast.longitude)
              sw = new google.maps.LatLng(newValue.southwest.latitude, newValue.southwest.longitude)
              bounds = new google.maps.LatLngBounds(sw, ne)
              _gMap.fitBounds bounds

            ['options','styles'].forEach (toWatch) ->
              scope.$watch toWatch, (newValue,oldValue) ->
                return if _.isEqual(newValue,oldValue)
                if toWatch == 'options'
                  opts.options = newValue
                else
                  opts.options[toWatch] = newValue
                _gMap.setOptions opts if _gMap?
              , true
