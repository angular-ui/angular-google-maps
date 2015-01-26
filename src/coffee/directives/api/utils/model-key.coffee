angular.module('uiGmapgoogle-maps.directives.api.utils')
.factory 'uiGmapModelKey', ['uiGmapBaseObject', 'uiGmapGmapUtil', 'uiGmapPromise', '$q', '$timeout',
  (BaseObject, GmapUtil, uiGmapPromise, $q, $timeout) ->
    class ModelKey extends BaseObject
      constructor: (@scope) ->
        super()
        ##common scope keys interface for iterating comparators
        @interface = {}
        @interface.scopeKeys = []

        @defaultIdKey = 'id'
        @idKey = undefined

      evalModelHandle: (model, modelKey) ->
        return if not model? or not modelKey?

        if modelKey == 'self'
          model
        else #modelKey may use dot-notation
          modelKey = modelKey() if _.isFunction(modelKey)
          GmapUtil.getPath(model, modelKey)

      modelKeyComparison: (model1, model2) =>
        hasCoords = _.contains(@interface.scopeKeys, 'coords')
        scope = @scope if hasCoords and  @scope.coords? or not hasCoords
        if not scope? then throw 'No scope set!'
        if hasCoords
          isEqual = GmapUtil.equalCoords  @scopeOrModelVal('coords', scope, model1),
            @scopeOrModelVal('coords', scope, model2)
          #deep comparison of the rest of properties
          return isEqual unless isEqual
        #compare the rest of the properties that are being watched by scope
        isEqual = _.every _.without(@interface.scopeKeys, 'coords'), (k) =>
          @scopeOrModelVal(scope[k], scope, model1) == @scopeOrModelVal(scope[k], scope, model2)
        isEqual


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

      getProp: (propName, scope, model) =>
        @scopeOrModelVal(propName, scope, model)

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
              c = @getChanges(now[prop], (if prev then prev[prop] else null))
              changes[prop] = c  unless _.isEmpty(c)
            else
              changes[prop] = now[prop]
        changes


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
          return maybeWrap true, scopeProp(model), doWrap
        if _.isObject scopeProp
          return maybeWrap true, scopeProp, doWrap
        unless _.isString scopeProp
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


      destroy: (manualOverride = false) =>
        if @scope? and not @scope?.$$destroyed and (@needToManualDestroy or manualOverride)
          @scope.$destroy()
        else
          @clean()
]
