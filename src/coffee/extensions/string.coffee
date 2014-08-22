String::contains = (value,fromIndex) ->
  @indexOf(value,fromIndex) != -1

String::flare = (flare = 'uiGmap') ->
  flare + @

String::ns = String::flare