angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapPolygonsParentModel', ['$timeout', 'uiGmapLogger',
  'uiGmapModelKey', 'uiGmapModelsWatcher', 'uiGmapPropMap',
  'uiGmapPolygonChildModel', 'uiGmap_async', 'uiGmapPromise',
  ($timeout, Logger, ModelKey, ModelsWatcher, PropMap, PolygonChildModel, _async, uiGmapPromise) ->
    class PolygonsParentModel extends ModelKey
      @include ModelsWatcher
      constructor: (@scope, @element, @attrs, @gMap, @defaults) ->
        super(scope)
        self = @
        @$log = Logger
        @plurals = new PropMap()
        @scopePropNames = [
          'path'
          'stroke'
          'clickable'
          'draggable'
          'editable'
          'geodesic'
          'icons'
          'visible'
        ]
        #setting up local references to propety keys IE: @pathKey
        _.each @scopePropNames, (name) => @[name + 'Key'] = undefined
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
            @[nameKey] = if typeof newValue == 'function' then newValue() else newValue
            @cleanOnResolve _async.waitOrGo @, =>
              _async.each @plurals.values(), (model) =>
                model.scope[name] = if @[nameKey] == 'self' then model else model[@[nameKey]]


      watchModels: (scope) =>
        scope.$watch 'models', (newValue, oldValue) =>
          #check to make sure that the newValue Array is really a set of new objects
          unless _.isEqual(newValue, oldValue)
            if @doINeedToWipe(newValue)
              @rebuildAll(scope, true, true)
            else
              @createChildScopes(false)
        , true

      doINeedToWipe: (newValue) =>
        newValueIsEmpty = if newValue? then newValue.length == 0 else true
        @plurals.length > 0 and newValueIsEmpty

      rebuildAll: (scope, doCreate, doDelete) =>
        @onDestroy(doDelete).then =>
          @createChildScopes() if doCreate

      onDestroy: (doDelete) =>
        @destroyPromise().then =>
          @cleanOnResolve _async.waitOrGo @, =>
            @plurals.each (model) =>
              model.destroy()
            uiGmapPromise.resolve()
          .then =>
            delete @plurals if doDelete
            @plurals = new PropMap()
            @isClearing = false

      watchDestroy: (scope)=>
        scope.$on '$destroy', =>
          @rebuildAll(scope, false, true)

      watchOurScope: (scope) =>
        _.each @scopePropNames, (name) =>
          nameKey = name + 'Key'
          @[nameKey] = if typeof scope[name] == 'function' then scope[name]() else scope[name]
          @watch(scope, name, nameKey)

      createChildScopes: (isCreatingFromScratch = true) =>
        if angular.isUndefined(@scope.models)
          @$log.error('No models to create Polygons from! I Need direct models!')
          return

        if @gMap?
          #at the very least we need a Map, the marker is optional as we can create Windows without markers
          if @scope.models?
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
        @cleanOnResolve _async.waitOrGo @, =>
          _async.each scope.models, (model) =>
            @createChild(model, @gMap)
        .then => #handle done callBack
          @firstTime = false

      pieceMeal: (scope, isArray = true)=>
        return if scope.$$destroyed or @isClearing
        return if @updateInProgress() and @plurals.length > 0

        @models = scope.models
        if scope? and scope.models? and scope.models.length > 0 and @plurals.length > 0
          @figureOutState @idKey, scope, @plurals, @modelKeyComparison, (state) =>
            payload = state
            @cleanOnResolve _async.waitOrGo @, =>
              _async.each payload.removals, (id)=>
                child = @plurals.get(id)
                if child?
                  child.destroy()
                  @plurals.remove(id)
              , false
              .then =>
                #add all adds via creating new ChildMarkers which are appended to @markers
                _async.each payload.adds, (modelToAdd) =>
                  @createChild(modelToAdd, @gMap)
                , false
        else
          @inProgress = false
          @rebuildAll(@scope, true, true)

      createChild: (model, gMap)=>
        childScope = @scope.$new(false)
        @setChildScope(@scopePropNames, childScope, model)

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
        child

      modelKeyComparison: (model1, model2) =>
        _.isEqual @evalModelHandle(model1, @scope.path), @evalModelHandle(model2, @scope.path)
]
