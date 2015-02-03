angular.module("uiGmapgoogle-maps.directives.api.utils")
.service "uiGmapEventsHelper", ["uiGmapLogger", ($log) ->
  setEvents: (gObject, scope, model, ignores) ->
    if angular.isDefined(scope.events) and scope.events? and angular.isObject(scope.events)
      _.compact _.map scope.events, (eventHandler, eventName) ->
        if ignores
          doIgnore = _(ignores).contains(eventName) #ignores to be invoked by internal listeners
        if scope.events.hasOwnProperty(eventName) and angular.isFunction(scope.events[eventName]) and !doIgnore
          google.maps.event.addListener gObject, eventName, ->
            #$scope.$evalAsync must exist, I have tried null checking, underscore key checking. Nothing works but having a real or fake $evalAsync
            #it would be nice to know why
            unless scope.$evalAsync
              scope.$evalAsync = ->
            scope.$evalAsync(eventHandler.apply(scope, [gObject, eventName, model, arguments]))

  removeEvents: (listeners) ->
    return unless listeners
    listeners.forEach (l) ->
      google.maps.event.removeListener(l) if l
]
