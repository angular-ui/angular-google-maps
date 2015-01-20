angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapPolygonsParentModel', ['$timeout', 'uiGmapLogger',
  'uiGmapModelKey', 'uiGmapModelsWatcher', 'uiGmapPropMap',
  'uiGmapPolygonChildModel', 'uiGmap_async', 'uiGmapPromise', 'uiGmapIPolygon',
  ($timeout, $log, ModelKey, ModelsWatcher, PropMap, PolygonChildModel, _async, uiGmapPromise, IPolygon) ->
    class PolygonsParentModel extends ModelKey
      @include ModelsWatcher
      constructor: (@scope, @element, @attrs, @gMap, @defaults) ->
        super(scope)
        @interface = IPolygon
        self = @
        @$log = $log
        @plurals = new PropMap()

        #setting up local references to propety keys IE: @pathKey
        _.each IPolygon.scopeKeys, (name) => @[name + 'Key'] = undefined
        @models = undefined
        @firstTime = true
        @$log.info @

        @watchOurScope(scope)
        @createChildScopes()

      #watch this scope(Parent to all Models), these updates reflect expression / Key changes
      #thus they need to be pushed to all the children models so that they are bound to the correct objects / keys
      watch: (scope, name, nameKey) =>
        scope.$watch name, (newValue, oldValue) =>
          if (newValue != oldValue)
            maybeCanceled =  null
            @[nameKey] = if _.isFunction newValue then newValue() else newValue

            _async.promiseLock @, uiGmapPromise.promiseTypes.update, "watch #{name} #{nameKey}"
            , ((canceledMsg) -> maybeCanceled = canceledMsg)
            , =>
              _async.each @plurals.values(), (model) =>
                model.scope[name] = if @[nameKey] == 'self' then model else model[@[nameKey]]
                maybeCanceled
              , _async.chunkSizeFrom scope.chunk


      watchModels: (scope) =>
        scope.$watchCollection 'models', (newValue, oldValue) =>
          #check to make sure that the newValue Array is really a set of new objects
          unless _.isEqual(newValue, oldValue) and (@lastNewValue != newValue or @lastOldValue != oldValue)
            @lastNewValue = newValue
            @lastOldValue = oldValue
            if @doINeedToWipe(newValue)
              @rebuildAll(scope, true, true)
            else
              @createChildScopes(false)

      doINeedToWipe: (newValue) =>
        newValueIsEmpty = if newValue? then newValue.length == 0 else true
        @plurals.length > 0 and newValueIsEmpty

      rebuildAll: (scope, doCreate, doDelete) =>
        @onDestroy(doDelete).then =>
          @createChildScopes() if doCreate

      onDestroy: (doDelete) =>
        _async.promiseLock @, uiGmapPromise.promiseTypes.delete, undefined, undefined, =>
          _async.each @plurals.values(), (child) =>
            child.destroy true #to make sure it is really dead, otherwise watchers can kick off (artifacts in path create)
          , _async.chunkSizeFrom(@scope.cleanchunk, false)
          .then =>
            delete @plurals if doDelete
            @plurals = new PropMap()

      watchDestroy: (scope)=>
        scope.$on '$destroy', =>
          @rebuildAll(scope, false, true)

      watchOurScope: (scope) =>
        _.each IPolygon.scopeKeys, (name) =>
          nameKey = name + 'Key'
          @[nameKey] = if typeof scope[name] == 'function' then scope[name]() else scope[name]
          @watch(scope, name, nameKey)

      createChildScopes: (isCreatingFromScratch = true) =>
        if angular.isUndefined(@scope.models)
          @$log.error('No models to create Polygons from! I Need direct models!')
          return

        return if not @gMap? or not @scope.models?
        @watchIdKey @scope
        if isCreatingFromScratch
          @createAllNew @scope, false
        else
          @pieceMeal @scope, false

      watchIdKey: (scope)=>
        @setIdKey scope
        scope.$watch 'idKey', (newValue, oldValue) =>
          if (newValue != oldValue and !newValue?)
            @idKey = newValue
            @rebuildAll(scope, true, true)

      createAllNew: (scope, isArray = false) =>
        @models = scope.models
        if @firstTime
          @watchModels scope
          @watchDestroy scope

        return if @didQueueInitPromise(@,scope)

        #allows graceful fallout of _async.each
        maybeCanceled = null
        _async.promiseLock @, uiGmapPromise.promiseTypes.create, 'createAllNew', ((canceledMsg) -> maybeCanceled = canceledMsg), =>
          _async.each scope.models, (model) =>
            child = @createChild(model, @gMap)
            if maybeCanceled
              $log.debug 'createNew should fall through safely'
              child.isEnabled = false
            maybeCanceled
          , _async.chunkSizeFrom scope.chunk
          .then =>
            #handle done callBack
            @firstTime = false

      pieceMeal: (scope, isArray = true)=>
        return if scope.$$destroyed
        #allows graceful fallout of _async.each
        maybeCanceled = null
        payload = null
        @models = scope.models

        if scope? and scope.models? and scope.models.length > 0 and @plurals.length > 0
          _async.promiseLock @, uiGmapPromise.promiseTypes.update, 'pieceMeal', ((canceledMsg) -> maybeCanceled = canceledMsg), =>
            uiGmapPromise.promise( => @figureOutState @idKey, scope, @plurals, @modelKeyComparison)
            .then (state) =>
              payload = state
              _async.each payload.removals, (id) =>
                child = @plurals.get(id)
                if child?
                  child.destroy()
                  @plurals.remove(id)
                  maybeCanceled
              , _async.chunkSizeFrom scope.chunk
            .then =>
              #add all adds via creating new ChildMarkers which are appended to @markers
              _async.each payload.adds, (modelToAdd) =>
                if maybeCanceled
                  $log.debug 'pieceMeal should fall through safely'
                @createChild(modelToAdd, @gMap)
                maybeCanceled
              , _async.chunkSizeFrom scope.chunk
        else
          @inProgress = false
          @rebuildAll(@scope, true, true)

      createChild: (model, gMap)=>
        childScope = @scope.$new(false)
        @setChildScope(IPolygon.scopeKeys, childScope, model)

        childScope.$watch('model', (newValue, oldValue) =>
          if(newValue != oldValue)
            @setChildScope(childScope, newValue)
        , true)

        childScope.static = @scope.static
        child = new PolygonChildModel childScope, @attrs, gMap, @defaults, model

        unless model[@idKey]?
          @$log.error """
            Polygon model has no id to assign a child to.
            This is required for performance. Please assign id,
            or redirect id to a different key.
          """
          return
        @plurals.put(model[@idKey], child)
#        $log.debug "create: " + @plurals.length
        child
]
