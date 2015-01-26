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
  (GoogleMapApi, Logger, GmapUtil, EventsHelper) ->
    name = 'uiGmapStreetViewPanorama'

    restrict: 'EMA'
    require: '^' + 'uiGmapGoogleMap'
    priority: -1
    template: '<span class="angular-google-map-street-view-panorama" ng-transclude></span>'
    replace: true
    scope:
      focal_coord: '='
      events: '='
      radius: '='
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

        focalPoint = GmapUtil.getCoords scope.focal_coord
        sv.getPanoramaByLocation position, scope.radius, (streetViewPanoramaData, status) ->
          if status is "OK"
            point = $scope.options?.position or streetViewPanoramaData.location.latLng
            heading = google.maps.geometry.spherical.computeHeading(point, focalPoint)

            opts = angular.extend
              navigationControl: false
              addressControl: false
              linksControl: false
              pov:
                heading: heading
                zoom: 1
                pitch: 0
              position: point
              visible: true
            , scope.options or {}

            didCreateOptionsFromDirective = true
            scope.options = opts
            pano = new google.maps.StreetViewPanorama(element, opts)
            didCreateOptionsFromDirective = false
      #end create

      if scope.control?
        scope.control.getGObject = ->
          sv

      scope.$watch 'options', (newValue, oldValue) ->
        #options are limited so we do not have to worry about them conflicting with positon
        return if newValue ==  oldValue or didCreateOptionsFromDirective
        create()

      scope.$on '$destroy', ->
        clean()



]
