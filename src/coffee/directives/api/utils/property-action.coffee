angular.module("google-maps.directives.api.utils".ns())
.factory "PropertyAction".ns(), ["Logger".ns(), (Logger) ->
  PropertyAction = (setterFn, isFirstSet, key) ->
    self = @
    @setIfChange = (newVal, oldVal) ->
      callingKey = @exp #calling function of this
      if not _.isEqual oldVal, newVal or isFirstSet
        setterFn(callingKey, newVal)
    #alias to setIfChange
    @sic = @setIfChange
    @
  PropertyAction
]
