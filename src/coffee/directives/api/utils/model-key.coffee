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

      # evaluate scope to scope.$parent (as long as isolate is false) with preference over models
      # this will allow for expressions and strings evals
      # returns
      #   doWrap: false
      #     a value evaluated as a function or object
      #   doWrap: true
      #     a object indicating where the value comes (isScope)
      #     isScope: true is from scope, false from model
      #     value: return value from doWrap false
      scopeOrModelVal: (key, scope, model, doWrap = false) ->
        maybeWrap = (isScope, ret, doWrap = false) ->
          if doWrap
            return {isScope: isScope, value: ret}
          ret
        scopeProp = scope[key]

        if _.isFunction scopeProp
          return maybeWrap true, scopeProp(), doWrap
        if _.isObject scopeProp
          return maybeWrap true, scopeProp, doWrap

        modelKey = scopeProp #this should be the key pointing to what we need
        unless modelKey
          modelProp = model[key]
        else
          modelProp = if modelKey == 'self' then model else model[modelKey]
        if _.isFunction modelProp
          return maybeWrap false, modelProp(), doWrap
        maybeWrap false, modelProp, doWrap


      setChildScope: (keys, childScope, model) =>
        _.each keys, (name) =>
          isScopeObj = @scopeOrModelVal name, childScope, model, true
          unless isScopeObj.isScope
            newValue = isScopeObj.value
            if(newValue != childScope[name])
              childScope[name] = newValue
        childScope.model = model

]
