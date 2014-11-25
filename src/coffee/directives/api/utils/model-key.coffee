angular.module('uiGmapgoogle-maps.directives.api.utils')
.factory 'uiGmapModelKey', ['uiGmapBaseObject', 'uiGmapGmapUtil', 'uiGmapPromise', '$q', '$timeout',
  (BaseObject, GmapUtil, uiGmapPromise, $q, $timeout) ->
    class ModelKey extends BaseObject
      constructor: (@scope) ->
        super()
        @defaultIdKey = 'id'
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
        if not scope? then throw 'No scope or parentScope set!'
        GmapUtil.equalCoords @evalModelHandle(model1, scope.coords),
          @evalModelHandle(model2, scope.coords)

      setIdKey: (scope) =>
        @idKey = if scope.idKey? then scope.idKey else @defaultIdKey

      setVal: (model, key, newValue) ->
        thingToSet = @modelOrKey model, key
        thingToSet = newValue
        model

      modelOrKey: (model, key) ->
        return unless key?
        if key != 'self'
          return model[key]
        model

      getProp: (propName, model) =>
        @modelOrKey(model, propName)

      ###
      For the cases were watching a large object we only want to know the list of props
      that actually changed.
      Also we want to limit the amount of props we analyze to whitelisted props that are
      actually tracked by scope. (should make things faster with whitelisted)
      ###
      getChanges: (now, prev, whitelistedProps) =>
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
              c = @getChanges(now[prop], prev[prop])
              changes[prop] = c  unless _.isEmpty(c)
            else
              changes[prop] = now[prop]
        changes


      # make sure that we don't trigger map updates too often. some events
      # can be triggered a lot which could stall whole app
      updateInProgress: () =>
        now = new Date()
        # two map updates can happen at least 250ms apart
        delta = now - @lastUpdate
        if delta <= 250
          return true
        if @inProgress
          return true
        @inProgress = true
        @lastUpdate = now
        return false

      cleanOnResolve: (promise) =>
        promise.catch =>
          @existingPieces = undefined
          @inProgress = false
          uiGmapPromise.resolve()
        .then =>
          @existingPieces = undefined
          @inProgress = false


      destroyPromise: =>
        @isClearing = true
        d = $q.defer()
        promise = d.promise
        checkInProgress = =>
          if @inProgress
            $timeout checkInProgress, 500
          else
            d.resolve()
        checkInProgress()
        return promise
]
