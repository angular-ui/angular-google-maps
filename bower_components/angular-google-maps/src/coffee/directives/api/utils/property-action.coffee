angular.module("google-maps.directives.api.utils")
.factory "nggmap-PropertyAction", ["Logger", (Logger) ->
  PropertyAction = (setterFn, isFirstSet) ->
    @setIfChange = (newVal,oldVal) ->
      if not _.isEqual oldVal, newVal or isFirstSet
        setterFn newVal
    @sic = (oldVal, newVal) =>
      @setIfChange oldVal, newVal
    @
  PropertyAction
]