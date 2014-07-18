###
    Simple Object Map with a lenght property to make it easy to track length/size
###
propsToPop = ['get', 'put', 'remove', 'values', 'keys', 'length', 'push', 'didValueStateChange','didKeyStateChange', 'slice', 'removeAll', 'allVals', 'allKeys', 'stateChanged']
class window.PropMap
  constructor: () ->
    @length = 0
    @didValueStateChange = false
    @didKeyStateChange = false
    @allVals = []
    @allKeys = []

  get: (key)=>
    @[key]

  stateChanged:() =>
    @didValueStateChange = true
    @didKeyStateChange = true

  #modify map through put or remove to keep track of length , otherwise the state will be incorrect
  put: (key, value)=>
    unless @get(key)? #if we are adding something new increment length
      @length++
    @stateChanged()
    @[key] = value

  remove: (key, isSafe = false)=>
    return undefined if isSafe and not @get key
    value = @[key]
    delete @[key]
    @length--
    @stateChanged()
    value

  values: ()=>
    return @allVals unless @didValueStateChange
    all = []
    @keys().forEach (key) =>
      all.push(@[key]) if _.indexOf(propsToPop, key) == -1
    all
    @didValueStateChange = false
    @keys()
    @allVals = all

  keys: ()=>
    return @allKeys unless @didKeyStateChange
    keys = _.keys @
    all = []
    _.each keys, (prop)=>
      all.push(prop) if _.indexOf(propsToPop, prop) == -1
    @didKeyStateChange = false
    @values()
    @allKeys = all

  push: (obj, key = "key") =>
    @put obj[key], obj

  slice: () =>
    @keys().map (k) =>
      @remove k

  removeAll: () =>
    @slice()

angular.module("google-maps.directives.api.utils")
.factory "PropMap",  ->
    window.PropMap