angular.module("uiGmapgoogle-maps.directives.api.utils")
.factory "uiGmapPropertyAction", ["uiGmapLogger", (Logger) ->

  PropertyAction = (setterFn) ->
    @setIfChange = (newVal, oldVal) ->
      callingKey = @exp #calling function of this
      if not _.isEqual oldVal, newVal
        setterFn(callingKey, newVal)
    #alias to setIfChange
    @sic = @setIfChange
    @
  PropertyAction
]
