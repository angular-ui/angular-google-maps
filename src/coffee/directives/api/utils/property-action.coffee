angular.module("google-maps.directives.api.utils")
.factory "nggmap-PropertyAction", ["Logger", (Logger) ->
  PropertyAction = (setterFn, getterFn) ->
    @setIfChange = (oldVal, newVal) ->
      if not _.isEqual oldVal, newVal
        setterFn newVal
    @sic = (oldVal, newVal) =>
      @setIfChange oldVal, newVal
    @
  PropertyAction
]