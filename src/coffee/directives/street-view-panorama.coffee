###
@authors:
- Nicholas McCready - https://twitter.com/nmccready
###

###
StreetViewPanorama Directive to care of basic initialization of StreetViewPanorama
###
angular.module('uiGmapgoogle-maps')
.directive 'uiGmapStreetViewPanorama', ['uiGmapGoogleMapApi', 'uiGmapLogger', 'uiGmapGmapUtil', 'uiGmapEventsHelper'
  (GoogleMapApi, $log, GmapUtil, EventsHelper) ->
    name = 'uiGmapStreetViewPanorama'

    restrict: 'EMA'
    template: '<div class="angular-google-map-street-view-panorama"></div>'
    replace: true
    scope:
      focalcoord: '='

      radius: '=?'
      events: '=?'
      options: '=?'
      control: '=?'
      povoptions: '=?'
      imagestatus: '='

    link: (scope, element, attrs) ->
      GoogleMapApi.then (maps) =>

        pano = undefined
        sv = undefined
        didCreateOptionsFromDirective = false
        listeners = undefined
        opts = null
        povOpts = null

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
          povOpts = angular.extend
            heading: heading
            zoom: 1
            pitch: 0
          , scope.povoptions or {}

          opts = opts = angular.extend
            navigationControl: false
            addressControl: false
            linksControl: false
            position: perspectivePoint
            pov: povOpts
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
            #get status via scope or callback
            scope.imagestatus = status if scope.imagestatus?
            if scope.events?.image_status_changed?
              scope.events.image_status_changed(sv, 'image_status_changed', scope, status)
            if status is "OK"
              perspectivePoint = streetViewPanoramaData.location.latLng
              #derrived
              handleSettings(perspectivePoint, focalPoint)
              ele = element[0]
              pano = new google.maps.StreetViewPanorama(ele, opts)


        if scope.control?
          scope.control.getOptions = ->
            opts
          scope.control.getPovOptions = ->
            povOpts
          scope.control.getGObject = ->
            sv
          scope.control.getGPano = ->
            pano

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
