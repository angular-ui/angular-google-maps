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
    template: '<div class="angular-google-map-street-view-panorama"></div>'
    replace: true
    scope:
      focalcoord: '='

      radius: '=?'
      events: '=?'
      options: '=?'
      control: '=?'
      povoptions: '=?'

    link: (scope, element, attrs) ->
      GoogleMapApi.then (maps) =>

        pano = undefined
        sv = undefined
        didCreateOptionsFromDirective = false
        listeners = undefined
        opts = null

        clean = ->
          EventsHelper.removeEvents listeners

          if pano?
            pano.unbind 'position'
            pano.setVisible false
          if sv?
            sv.setVisible false if sv?.setVisible?
            sv = undefined

        handleSettings = (perspectivePoint, focalPoint) ->
          heading = google.maps.geometry.spherical.computeHeading(perspectivePoint, focalPoint)
          didCreateOptionsFromDirective = true
          #options down
          scope.radius = scope.radius or 50
          scope.povoptions = angular.extend
            heading: heading
            zoom: 1
            pitch: 0
          , scope.povoptions or {}

          scope.options = opts = angular.extend
            navigationControl: false
            addressControl: false
            linksControl: false
            position: perspectivePoint
            pov: scope.povoptions
            visible: true
          , scope.options or {}
          didCreateOptionsFromDirective = false

        create = ->
          unless scope.focalcoord
            $log.error "#{name}: focalCoord needs to be defined"
            return
          unless scope.radius
            $log.error "#{name}: needs a radius to set the camera view from its focal target."
            return

          clean()

          unless sv?
            sv = new google.maps.StreetViewService()

          if scope.events
            listeners = EventsHelper.setEvents sv, scope, scope

          focalPoint = GmapUtil.getCoords scope.focalcoord

          sv.getPanoramaByLocation focalPoint, scope.radius, (streetViewPanoramaData, status) ->
            if status is "OK"
              perspectivePoint = scope.options?.position or streetViewPanoramaData.location.latLng
              #derrived
              handleSettings(perspectivePoint, focalPoint)
              ele = element[0]
              pano = new google.maps.StreetViewPanorama(ele, scope.options)


        if scope.control?
          scope.control.getGObject = ->
            sv

        scope.$watch 'options', (newValue, oldValue) ->
          #options are limited so we do not have to worry about them conflicting with positon
          return if newValue == oldValue or newValue == opts  or didCreateOptionsFromDirective
          create()

        firstTime = true
        scope.$watch 'focalcoord', (newValue, oldValue) ->
          return if newValue ==  oldValue and not firstTime
          return unless newValue?
          firstTime = false
          create()

        scope.$on '$destroy', ->
          clean()
]
