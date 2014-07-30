angular.module("google-maps.directives.api.utils")
.service "EventsHelper", ["Logger", ($log) ->
      setEvents: (gObject, scope, model,ignores) ->
        if angular.isDefined(scope.events) and scope.events? and angular.isObject(scope.events)
          _.compact _.map scope.events, (eventHandler, eventName) ->
            if ignores
              doIgnore = _(ignores).contains(eventName)
            if scope.events.hasOwnProperty(eventName) and angular.isFunction(scope.events[eventName]) and !doIgnore
              google.maps.event.addListener(gObject, eventName, ->
                eventHandler.apply(scope, [gObject, eventName, model, arguments]))
            else
              $log.info "EventHelper: invalid event listener #{eventName}"

      removeEvents: (listeners) ->
        listeners?.forEach (l) ->
          google.maps.event.removeListener l
  ]
