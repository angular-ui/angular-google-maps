angular.module("google-maps.directives.api.utils".ns())
.factory "PropertyAction".ns(), ["Logger".ns(), (Logger) ->
  PropertyAction = (setterFn, isFirstSet) ->
    @setIfChange = (newVal, oldVal) ->
      if not _.isEqual oldVal, newVal or isFirstSet
        setterFn newVal
    @sic = (oldVal, newVal) =>
      @setIfChange oldVal, newVal
    @
  PropertyAction
]