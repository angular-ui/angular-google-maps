angular.module("google-maps.directives.api.models.parent".ns())
.factory "RectangleParentModel".ns(),
["Logger".ns(),"GmapUtil".ns(),
"EventsHelper".ns(), "RectangleOptionsBuilder".ns(),
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
          if bound?
            $log.error "Invalid bounds for newValue: #{JSON.stringify scope.bounds}"
      createBounds()
      rectangle = new google.maps.Rectangle(@buildOpts bounds)
      $log.info "rectangle created: #{rectangle}"

      settingBoundsFromScope = false

      updateBounds = =>
        b = rectangle.getBounds()
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
        myListeners.push google.maps.event.addListener rectangle, "dragstart", ->
          dragging = true
        myListeners.push google.maps.event.addListener rectangle, "dragend", ->
          dragging = false
          updateBounds()
        myListeners.push google.maps.event.addListener rectangle, "bounds_changed", ->
          return if dragging
          updateBounds()

      clear = =>
        @removeEvents myListeners
        @removeEvents listeners if listeners?
        rectangle.setMap null

      init() if bounds?
      # Update map when center coordinates change
      scope.$watch "bounds", ((newValue, oldValue) ->
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
        rectangle.setBounds bounds
        settingBoundsFromScope = false
        init() if isNew and bounds?
      ), true

      @setMyOptions = (newVals, oldVals) =>
        unless _.isEqual newVals,oldVals
          if bounds? and newVals?
            rectangle.setOptions @buildOpts bounds

      @props.push 'bounds'
      @watchProps @props

      if attrs.events?
        listeners = @setEvents rectangle, scope, scope
        scope.$watch "events", (newValue, oldValue) =>
          unless _.isEqual newValue, oldValue
            @removeEvents listeners if listeners?
            listeners = @setEvents rectangle, scope, scope
      # Remove rectangle on scope $destroy
      scope.$on "$destroy", =>
        clear()

      $log.info @
]
