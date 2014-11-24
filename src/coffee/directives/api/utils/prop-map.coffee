###
    Simple Object Map with a lenght property to make it easy to track length/size
###
propsToPop = ['get', 'put', 'remove', 'values', 'keys', 'length', 'push', 'didValueStateChange', 'didKeyStateChange',
  'slice', 'removeAll', 'allVals', 'allKeys', 'stateChanged']
class window.PropMap
  constructor: () ->
    @length = 0
    @dict = {}
    @didValsStateChange = false
    @didKeysStateChange = false
    @allVals = []
    @allKeys = []

  get: (key)=>
    @dict[key]

  stateChanged: =>
    @didValsStateChange = true
    @didKeysStateChange = true

  #modify map through put or remove to keep track of length , otherwise the state will be incorrect
  put: (key, value)=>
    unless @get(key)? #if we are adding something new increment length
      @length++
    @stateChanged()
    @dict[key] = value

  remove: (key, isSafe = false)=>
    return undefined if isSafe and not @get key
    value = @dict[key]
    delete @dict[key]
    @length--
    @stateChanged()
    value

  valuesOrKeys: (str = 'Keys') ->
    return @['all' + str] unless @["did#{str}StateChange"]
    vals = []
    keys = []
    _.each @dict, (v, k)->
      vals.push v
      keys.push k
    @didKeysStateChange = false
    @didValsStateChange = false

    @allVals = vals
    @allKeys = keys
    return @['all' + str]

  values: =>
    @valuesOrKeys 'Vals'

  keys: =>
    @valuesOrKeys()

  push: (obj, key = "key") =>
    @put obj[key], obj

  slice: =>
    @keys().map (k) =>
      @remove k

  removeAll: =>
    @slice()

  each: (cb) ->
    _.each @dict, (v, k) ->
      cb(v)

  map: (cb) ->
    _.map @dict, (v, k) ->
      cb(v)

angular.module("uiGmapgoogle-maps.directives.api.utils")
.factory "uiGmapPropMap", ->
  window.PropMap
