angular.module("uiGmapgoogle-maps.directives.api.utils")
.service "uiGmapEventsHelper", ["uiGmapLogger", ($log) ->
  _hasEvents = (obj) ->
    angular.isDefined(obj.events) and obj.events? and angular.isObject(obj.events)

  _getEventsObj = (scope, model) ->
    if _hasEvents scope
      return scope
    if _hasEvents model
      return model


  setEvents: (gObject, scope, model, ignores) ->
    eventObj = _getEventsObj scope, model

    if eventObj?
      _.compact _.map eventObj.events, (eventHandler, eventName) ->
        if ignores
          doIgnore = _(ignores).contains(eventName) #ignores to be invoked by internal listeners
        if eventObj.events.hasOwnProperty(eventName) and angular.isFunction(eventObj.events[eventName]) and !doIgnore
          google.maps.event.addListener gObject, eventName, ->
            #$scope.$evalAsync must exist, I have tried null checking, underscore key checking. Nothing works but having a real or fake $evalAsync
            #it would be nice to know why
            unless scope.$evalAsync
              scope.$evalAsync = ->
            scope.$evalAsync(eventHandler.apply(scope, [gObject, eventName, model, arguments]))

  removeEvents: (listeners) ->
    return unless listeners
    for key, l of listeners
      google.maps.event.removeListener l if l
    return
]
