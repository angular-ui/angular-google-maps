angular.module('uiGmapgoogle-maps')
.factory 'uiGmapadd-events', ['$timeout', ($timeout) ->
  addEvent = (target, eventName, handler) ->
    google.maps.event.addListener target, eventName, ->
      handler.apply this, arguments
      $timeout((->),true)

  addEvents = (target, eventName, handler) ->
    return addEvent(target, eventName, handler)  if handler
    remove = []
    angular.forEach eventName, (_handler, key) ->
      remove.push addEvent(target, key, _handler)
    return ->
      angular.forEach remove, (listener) ->
        google.maps.event.removeListener listener
      remove = null
  addEvents
]
