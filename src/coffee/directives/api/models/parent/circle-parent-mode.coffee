angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapCircleParentModel',
['uiGmapLogger', '$timeout','uiGmapGmapUtil',
'uiGmapEventsHelper', 'uiGmapCircleOptionsBuilder',
($log, $timeout, GmapUtil, EventsHelper, Builder) ->
  class CircleParentModel extends Builder
    @include GmapUtil
    @include EventsHelper
    constructor: (@scope, element, @attrs, @map, @DEFAULTS) ->
      clean = =>
        if @listeners?
          @removeEvents @listeners
          @listeners = undefined
      gObject =
        new google.maps.Circle @buildOpts GmapUtil.getCoords(scope.center), scope.radius

      @setMyOptions = (newVals, oldVals) =>
        unless _.isEqual newVals,oldVals
          gObject.setOptions @buildOpts GmapUtil.getCoords(scope.center), scope.radius

      @props = @props.concat [
        {prop: 'center',isColl: true}
        {prop: 'fill',isColl: true}
        'radius'
      ]
      @watchProps()

      clean()
      @listeners = @setEvents gObject, scope, scope, ['radius_changed']

      @listeners.push google.maps.event.addListener gObject, 'radius_changed', ->
      @listeners.push google.maps.event.addListener gObject, 'radius_changed', ->
        ## radius_changed appears to fire twice (original and new) which is not too helpful
        scope.$evalAsync ->
          newRadius = gObject.getRadius()
          scope.radius = newRadius if newRadius != scope.radius

      @listeners.push google.maps.event.addListener gObject, 'center_changed', ->
        scope.$evalAsync ->
          if angular.isDefined(scope.center.type)
            scope.center.coordinates[1] = gObject.getCenter().lat()
            scope.center.coordinates[0] = gObject.getCenter().lng()
          else
            scope.center.latitude = gObject.getCenter().lat()
            scope.center.longitude = gObject.getCenter().lng()

      scope.$on '$destroy', =>
        clean()
        gObject.setMap null

      $log.info @
]
