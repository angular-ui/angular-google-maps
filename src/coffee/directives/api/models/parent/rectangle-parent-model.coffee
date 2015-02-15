angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapRectangleParentModel',
['uiGmapLogger','uiGmapGmapUtil',
'uiGmapEventsHelper', 'uiGmapRectangleOptionsBuilder',
($log,GmapUtil,
  EventsHelper, Builder) ->
  class RectangleParentModel extends Builder
    @include GmapUtil
    @include EventsHelper
    constructor: (@scope, element, @attrs, @map, @DEFAULTS) ->
      # Validate required properties
      bounds = undefined
      dragging = false
      myListeners = []
      listeners = undefined
      fit = =>
        @fitMapBounds @map, bounds  if @isTrue(attrs.fit)
      createBounds = =>
        if scope.bounds? and scope.bounds?.sw? and scope.bounds?.ne? and @validateBoundPoints(scope.bounds)
          bounds = @convertBoundPoints(scope.bounds)
          $log.info "new new bounds created: #{rectangle}"
        else if scope.bounds.getNorthEast? and scope.bounds.getSouthWest? #google format
            bounds = scope.bounds
        else
          if scope.bounds?
            $log.error "Invalid bounds for newValue: #{JSON.stringify scope.bounds}" #note if bounds is recursive this could crash
      createBounds()
      gObject = new google.maps.Rectangle(@buildOpts bounds)
      $log.info "gObject (rectangle) created: #{gObject}"

      settingBoundsFromScope = false

      updateBounds = =>
        b = gObject.getBounds()
        ne = b.getNorthEast()
        sw = b.getSouthWest()
        #if the scope notified this change then there is no reason
        #to update scope otherwise infinite loop
        return if settingBoundsFromScope
        scope.$evalAsync (s) ->
          if s.bounds? and s.bounds.sw? and s.bounds.ne?
            s.bounds.ne =
              latitude: ne.lat()
              longitude: ne.lng()

            s.bounds.sw =
              latitude: sw.lat()
              longitude: sw.lng()
          if s.bounds.getNorthEast? and s.bounds.getSouthWest?
            s.bounds = b

      init = =>
        fit()
        @removeEvents myListeners
        myListeners.push google.maps.event.addListener gObject, 'dragstart', ->
          dragging = true
        myListeners.push google.maps.event.addListener gObject, 'dragend', ->
          dragging = false
          updateBounds()
        myListeners.push google.maps.event.addListener gObject, 'bounds_changed', ->
          return if dragging
          updateBounds()

      clear = =>
        @removeEvents myListeners
        @removeEvents listeners if listeners?
        gObject.setMap null

      init() if bounds?
      # Update map when center coordinates change
      scope.$watch 'bounds', ((newValue, oldValue) ->
        return  if _.isEqual(newValue, oldValue) and bounds? or dragging
        settingBoundsFromScope = true
        unless newValue?
          clear()
          return
        unless bounds?
          isNew = true
        else
          fit()
        createBounds()
        gObject.setBounds bounds
        settingBoundsFromScope = false
        init() if isNew and bounds?
      ), true

      @setMyOptions = (newVals, oldVals) =>
        unless _.isEqual newVals,oldVals
          if bounds? and newVals?
            gObject.setOptions @buildOpts bounds

      @props.push 'bounds'
      @watchProps @props

      if attrs.events?
        listeners = @setEvents gObject, scope, scope
        scope.$watch 'events', (newValue, oldValue) =>
          unless _.isEqual newValue, oldValue
            @removeEvents listeners if listeners?
            listeners = @setEvents gObject, scope, scope
      # Remove gObject on scope $destroy
      scope.$on '$destroy', =>
        clear()

      $log.info @
]
