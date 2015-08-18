angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapBasePolysParentModel', [
  '$timeout', 'uiGmapLogger','uiGmapModelKey', 'uiGmapModelsWatcher',
  'uiGmapPropMap', 'uiGmap_async', 'uiGmapPromise', 'uiGmapFitHelper'
  ($timeout, $log, ModelKey, ModelsWatcher,
    PropMap, _async, uiGmapPromise, FitHelper) ->
    (IPoly, PolyChildModel, gObjectName) ->
      class BasePolysParentModel extends ModelKey
        @include ModelsWatcher
        constructor: (scope, @element, @attrs, @gMap, @defaults) ->
          super(scope)
          @interface = IPoly

          @$log = $log
          @plurals = new PropMap()

          #setting up local references to propety keys IE: @pathKey
          _.each IPoly.scopeKeys, (name) => @[name + 'Key'] = undefined
          @models = undefined
          @firstTime = true
          @$log.info @

          # @watchOurScope(scope)
          @createChildScopes()

        watchModels: (scope) =>
          ###
            This was watchCollection but not all model changes were being caught.
            TODO: Make the directive flexible in overriding whether we watch models (and depth) via watch or watchColleciton.
          ###
          scope.$watch 'models', (newValue, oldValue) =>
            unless newValue == oldValue
              if @doINeedToWipe(newValue) or scope.doRebuildAll
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

        onDestroy: (scope) =>
          super(@scope)
          _async.promiseLock @, uiGmapPromise.promiseTypes.delete, undefined, undefined, =>
            _async.each @plurals.values(), (child) =>
              child.destroy true #to make sure it is really dead, otherwise watchers can kick off (artifacts in path create)
            , _async.chunkSizeFrom(@scope.cleanchunk, false)
            .then =>
              @plurals?.removeAll()

        watchDestroy: (scope)=>
          scope.$on '$destroy', =>
            @rebuildAll(scope, false, true)

        createChildScopes: (isCreatingFromScratch = true) =>
          if angular.isUndefined(@scope.models)
            @$log.error("No models to create #{gObjectName}s from! I Need direct models!")
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
            _async.map scope.models, (model) =>
              child = @createChild(model, @gMap)
              if maybeCanceled
                $log.debug 'createNew should fall through safely'
                child.isEnabled = false
              maybeCanceled
              child.pathPoints.getArray()
            , _async.chunkSizeFrom scope.chunk
            .then (pathPoints) =>
              @maybeFit(pathPoints)
              #handle done callBack
              @firstTime = false

        pieceMeal: (scope, isArray = true)=>
          return if scope.$$destroyed
          #allows graceful fallout of _async.each
          maybeCanceled = null
          payload = null
          @models = scope.models

          if scope? and @modelsLength() and @plurals.length
            _async.promiseLock @, uiGmapPromise.promiseTypes.update, 'pieceMeal', ((canceledMsg) -> maybeCanceled = canceledMsg), =>
              uiGmapPromise.promise( => @figureOutState @idKey, scope, @plurals, @modelKeyComparison)
              .then (state) =>
                payload = state
                if(payload.updates.length)
                  _async.each payload.updates, (obj) =>
                    _.extend obj.child.scope, obj.model
                    obj.child.model = obj.model
                _async.each payload.removals, (child) =>
                  if child?
                    child.destroy()
                    @plurals.remove(child.model[@idKey])
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
                .then =>
                  @maybeFit()
          else
            @inProgress = false
            @rebuildAll(@scope, true, true)

        createChild: (model, gMap)=>
          childScope = @scope.$new(false)
          @setChildScope(IPoly.scopeKeys, childScope, model)

          childScope.$watch 'model', (newValue, oldValue) =>
            if(newValue != oldValue)
              @setChildScope(childScope, newValue)
          , true

          childScope.static = @scope.static
          child = new PolyChildModel childScope, @attrs, gMap, @defaults, model, =>
            @maybeFit()

          unless model[@idKey]?
            @$log.error """
              #{gObjectName} model has no id to assign a child to.
              This is required for performance. Please assign id,
              or redirect id to a different key.
            """
            return
          @plurals.put(model[@idKey], child)
  #        $log.debug "create: " + @plurals.length
          child

        maybeFit: (pathPoints = @plurals.map (p) -> p.pathPoints) =>
          if @scope.fit
            pathPoints = _.flatten pathPoints
            FitHelper.fit pathPoints, @gMap
]
