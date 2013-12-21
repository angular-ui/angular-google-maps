angular.module("google-maps").factory "add-events", ["$timeout", ($timeout) ->
    addEvent = (target, eventName, handler) ->
        google.maps.event.addListener target, eventName, ->
            handler.apply this, arguments
            $timeout (->
            ), true

    addEvents = (target, eventName, handler) ->
        return addEvent(target, eventName, handler)  if handler
        remove = []
        angular.forEach eventName, (_handler, key) ->

            #console.log('adding listener: ' + key + ": " + _handler.toString() + " to : " + target);
            remove.push addEvent(target, key, _handler)

        ->
            angular.forEach remove, (fn) ->
                fn()  if _.isFunction(fn)
                fn.e()  if fn.e isnt null and _.isFunction(fn.e)

            remove = null
    addEvents
]