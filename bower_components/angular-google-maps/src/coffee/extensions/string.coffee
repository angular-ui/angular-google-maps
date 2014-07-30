String::contains = (value,fromIndex) ->
  @indexOf(value,fromIndex) != -1

String::flare = (flare = 'nggmap') ->
  flare + @

String::ns = String::flare