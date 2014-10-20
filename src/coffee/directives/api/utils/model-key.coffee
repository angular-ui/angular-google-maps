angular.module("google-maps.directives.api.utils".ns())
.factory "ModelKey".ns(), ["BaseObject".ns(), "GmapUtil".ns(), (BaseObject, GmapUtil) ->
  class ModelKey extends BaseObject
    constructor: (@scope) ->
      super()
      @defaultIdKey = "id"
      @idKey = undefined

    evalModelHandle: (model, modelKey) ->
      if model == undefined or modelKey == undefined
        return undefined
      if modelKey == 'self'
        model
      else #modelKey may use dot-notation
        GmapUtil.getPath(model, modelKey)

    modelKeyComparison: (model1, model2) =>
      scope = if @scope.coords? then @scope else @parentScope
      if not scope? then throw "No scope or parentScope set!"
      GmapUtil.equalCoords @evalModelHandle(model1, scope.coords),
        @evalModelHandle(model2, scope.coords)

    setIdKey: (scope) =>
      @idKey = if scope.idKey? then scope.idKey else @defaultIdKey

    setVal: (model, key, newValue) ->
      thingToSet = @modelOrKey model, key
      thingToSet = newValue
      model

    modelOrKey: (model, key) ->
      thing = if key != 'self' then model[key] else model
      thing

    ###
    For the cases were watching a large object we only want to know the list of props
    that actually changed.
    Also we want to limit the amount of props we analyze to whitelisted props that are
    actually tracked by scope. (should make things faster with whitelisted)
    ###
    getChanges: (prev, now, whitelistedProps) =>
      if whitelistedProps
        prev = _.pick prev, whitelistedProps
        now = _.pick now, whitelistedProps
      changes = {}
      prop = {}
      c = {}

      for prop of now #ignore jslint
        if not prev or prev[prop] isnt now[prop]
          if _.isArray(now[prop])
            changes[prop] = now[prop]
          else if _.isObject(now[prop])
            # Recursion alert
            c = @getChanges(prev[prop], now[prop])
            changes[prop] = c  unless _.isEmpty(c)
          else
            changes[prop] = now[prop]
      changes
]
