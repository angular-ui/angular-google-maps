###
@authors:
- Nicolas Laplante https://plus.google.com/108189012221374960701
- Nicholas McCready - https://twitter.com/nmccready
- Carrie Kengle - http://about.me/carrie
###

###
StreetViewPanorama Directive to care of basic initialization of StreetViewPanorama
###
angular.module('uiGmapgoogle-maps')
.directive 'uiGmapStreetViewPanorama', ['uiGmapGoogleMapApi', 'uiGmapLogger', 'uiGmapGmapUtil', 'uiGmapEventsHelper'
  (GoogleMapApi, $log, GmapUtil, EventsHelper) ->
    name = 'uiGmapStreetViewPanorama'

    restrict: 'EMA'
    priority: -1
    template: '<span class="angular-google-map-street-view-panorama"></span>'
    replace: true
    scope:
      focal_coord: '='

      radius: '=?'
      events: '=?'
      options: '=?'
      control: '=?'
      pov_options: '=?'

    link: (scope, element, attrs) ->
      GoogleMapApi.then (maps) =>
        pano = undefined
        sv = undefined
        didCreateOptionsFromDirective = false
        listeners = undefined

        clean = ->
          EventsHelper.removeEvents listeners

          if pano?
            pano.unbind 'position'
            pano.setVisible false
          if sv?
            sv.setVisible false
            sv = undefined

        handleSettings = (point) ->
          didCreateOptionsFromDirective = true

          #required
          focalPoint = GmapUtil.getCoords scope.focal_coord
          #derrived
          heading = google.maps.geometry.spherical.computeHeading(point, focalPoint)
          #options down
          scope.radius = scope.radius or 50
          scope.pov_options = angular.extend
            heading: heading
            zoom: 1
            pitch: 0
          , scope.pov_options or {}

          scope.pov_options = pov

          scope.options = angular.extend
            navigationControl: false
            addressControl: false
            linksControl: false
            position: point
            pov: pov
            visible: true
          , scope.options or {}
          didCreateOptionsFromDirective = false

        create = ->
          unless scope.focal_coord
            $log.error "#{name}: focalCoord needs to be defined"
            return
          unless scope.radius
            $log.error "#{name}: needs a radius to set the camera view from its focal target."
            return

          clean()

          unless sv?
            sv = new google.maps.StreetViewService()
          sv?.setOptions scope.options

          if scope.events
            listeners = EventsHelper.setEvents sv, scope, scope
          position = scope.options?.position or sv.location.latLng
          handleSettings(position)

          sv.getPanoramaByLocation position, scope.radius, (streetViewPanoramaData, status) ->
            if status is "OK"
              scope.options = opts
              pano = new google.maps.StreetViewPanorama(element, scope.options)


        if scope.control?
          scope.control.getGObject = ->
            sv

        firstTime = true
        scope.$watch 'options', (newValue, oldValue) ->
          #options are limited so we do not have to worry about them conflicting with positon
          return if (newValue ==  oldValue or didCreateOptionsFromDirective) and not firstTime
          firstTime = false unless firstTime
          create()

        scope.$watch 'focal_coord', (newValue, oldValue) ->
          return if newValue ==  oldValue
          create()

        scope.$on '$destroy', ->
          clean()
]
