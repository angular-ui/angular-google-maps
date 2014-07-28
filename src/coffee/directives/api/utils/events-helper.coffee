angular.module("google-maps.directives.api.utils")
.service "EventsHelper", ["Logger", ($log) ->
      setEvents: (marker, scope, model,ignores) ->
        if angular.isDefined(scope.events) and scope.events? and angular.isObject(scope.events)
          _.compact _.map scope.events, (eventHandler, eventName) ->
            if ignores
              doIgnore = _(ignores).contains(eventName)
            if scope.events.hasOwnProperty(eventName) and angular.isFunction(scope.events[eventName]) and !doIgnore
              google.maps.event.addListener(marker, eventName, ->
                eventHandler.apply(scope, [marker, eventName, model, arguments]))
            else
              $log.info "MarkerEventHelper: invalid event listener #{eventName}"
  ]
