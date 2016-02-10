###globals angular,_###
angular.module("uiGmapgoogle-maps.directives.api.utils")
.factory "uiGmapPropertyAction", ["uiGmapLogger", (Logger) ->

  PropertyAction = (setterFn) ->
    @setIfChange = (callingKey) -> (newVal, oldVal) ->
      if not _.isEqual oldVal, newVal
        setterFn(callingKey, newVal)
    #alias to setIfChange
    @sic = @setIfChange
    @
  PropertyAction
]
