angular.module("uiGmapgoogle-maps.directives.api.models.parent")
.factory "uiGmapMarkersParentModel", [
  "uiGmapIMarkerParentModel", "uiGmapModelsWatcher",
  "uiGmapPropMap", "uiGmapMarkerChildModel", "uiGmap_async",
  "uiGmapClustererMarkerManager", "uiGmapMarkerManager", "$timeout", "uiGmapIMarker",
  "uiGmapPromise", "uiGmapGmapUtil", "uiGmapLogger",
    (IMarkerParentModel, ModelsWatcher,
      PropMap, MarkerChildModel, _async,
      ClustererMarkerManager, MarkerManager, $timeout, IMarker, uiGmapPromise, GmapUtil, $log) ->
        class MarkersParentModel extends IMarkerParentModel
          @include GmapUtil
          @include ModelsWatcher
          constructor: (scope, element, attrs, map) ->
            super(scope, element, attrs, map)
            @interface = IMarker
            self = @

            @plurals = new PropMap() #for api consistency
            @scope.plurals = @plurals #for transclusion
            @scope.pluralsUpdate =
              updateCtr: 0

            @$log.info @
            #assume do rebuild all is false and were lookging for a modelKey prop of id
            @doRebuildAll = if @scope.doRebuildAll? then @scope.doRebuildAll else false
            @setIdKey scope
            @scope.$watch 'doRebuildAll', (newValue, oldValue) =>
              if (newValue != oldValue)
                @doRebuildAll = newValue

            @modelsRendered = false if not scope.models? or scope.models.length == 0
            @scope.$watch 'models', (newValue, oldValue) =>
              if !_.isEqual(newValue,oldValue) or not @modelsRendered
                return if newValue.length == 0 and oldValue.length == 0
                @modelsRendered = true
                @onWatch('models', scope, newValue, oldValue)
            , !@isTrue(attrs.modelsbyref)

            @watch 'doCluster', scope
            @watch 'clusterOptions', scope
            @watch 'clusterEvents', scope
            @watch 'fit', scope
            @watch 'idKey', scope

            @gManager = undefined
            @createAllNew(scope)


          onWatch: (propNameToWatch, scope, newValue, oldValue) =>
            if propNameToWatch == "idKey" and newValue != oldValue
              @idKey = newValue
            if @doRebuildAll or propNameToWatch == 'doCluster'
              @rebuildAll(scope)
            else
              @pieceMeal(scope)

          validateScope: (scope)=>
            modelsNotDefined = angular.isUndefined(scope.models) or scope.models == undefined
            if(modelsNotDefined)
              @$log.error(@constructor.name + ": no valid models attribute found")

            super(scope) or modelsNotDefined

          ###
          Not used internally by this parent
          created for consistency for external control in the API
          ###
          createChildScopes: (isCreatingFromScratch) =>
            return if not @gMap? or not @scope.models?

            if isCreatingFromScratch
              @createAllNew @scope, false
            else
              @pieceMeal @scope, false

          createAllNew: (scope) =>
            if @gManager?
              @gManager.clear()
              delete @gManager

            if scope.doCluster
              if scope.clusterEvents
                self = @
                if not @origClusterEvents
                  @origClusterEvents =
                    click: scope.clusterEvents?.click
                    mouseout: scope.clusterEvents?.mouseout
                    mouseover: scope.clusterEvents?.mouseover
                else
                  #rollback to not have stack overflow to call self over and over
                  angular.extend scope.clusterEvents, @origClusterEvents

                angular.extend scope.clusterEvents,
                  click:(cluster) ->
                    self.maybeExecMappedEvent cluster, 'click'
                  mouseout:(cluster) ->
                    self.maybeExecMappedEvent cluster, 'mouseout'
                  mouseover:(cluster) ->
                    self.maybeExecMappedEvent cluster, 'mouseover'

              @gManager = new ClustererMarkerManager @map, undefined, scope.clusterOptions, scope.clusterEvents
            else
              @gManager = new MarkerManager @map

            return if @didQueueInitPromise(@,scope)

            #allows graceful fallout of _async.each
            maybeCanceled = null

            _async.promiseLock @, uiGmapPromise.promiseTypes.create, 'createAllNew'
            , ((canceledMsg) -> maybeCanceled= canceledMsg)
            , =>
              _async.each scope.models, (model) =>
                @newChildMarker(model, scope)
                maybeCanceled
              , _async.chunkSizeFrom scope.chunk
              .then =>
                @modelsRendered = true
                @gManager.fit() if scope.fit
                @gManager.draw()
                @scope.pluralsUpdate.updateCtr += 1
              , _async.chunkSizeFrom scope.chunk

          rebuildAll: (scope) =>
            if(!scope.doRebuild and scope.doRebuild != undefined)
              return
            if @scope.plurals?.length
              @onDestroy(scope).then =>
                @createAllNew(scope)
            else
              @createAllNew(scope)

          pieceMeal: (scope) =>
            return if scope.$$destroyed
            #allows graceful fallout of _async.each
            maybeCanceled = null
            payload = null
            if @scope.models? and @scope.models.length > 0 and @scope.plurals.length > 0 #and @scope.models.length == @scope.plurals.length

              _async.promiseLock @, uiGmapPromise.promiseTypes.update, 'pieceMeal', ((canceledMsg) -> maybeCanceled = canceledMsg), =>
                uiGmapPromise.promise((=> @figureOutState @idKey, scope, @scope.plurals, @modelKeyComparison))
                .then (state) =>
                  payload = state
                  _async.each payload.removals, (child) =>
                    if child?
                      child.destroy() if child.destroy?
                      @scope.plurals.remove(child.id)
                      maybeCanceled
                  , _async.chunkSizeFrom scope.chunk
                .then =>
                    #add all adds via creating new ChildMarkers which are appended to @scope.plurals
                  _async.each payload.adds, (modelToAdd) =>
                    @newChildMarker(modelToAdd, scope)
                    maybeCanceled
                  , _async.chunkSizeFrom scope.chunk
                .then () =>
                  _async.each payload.updates, (update) =>
                    @updateChild update.child, update.model
                    maybeCanceled
                  , _async.chunkSizeFrom scope.chunk
                .then =>
                  #finally redraw if something has changed
                  if(payload.adds.length > 0 or payload.removals.length > 0 or payload.updates.length > 0)
                    scope.plurals = @scope.plurals #for other directives like windows
                    @gManager.fit() if scope.fit #note fit returns a promise
                    @gManager.draw()
                  @scope.pluralsUpdate.updateCtr += 1

            else
              @inProgress = false
              @rebuildAll(scope)

          newChildMarker: (model, scope)=>
            unless model[@idKey]?
              @$log.error("Marker model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.")
              return
            @$log.info('child', child, 'markers', @scope.plurals)
            childScope = scope.$new(true)
            childScope.events = scope.events
            keys = {}
            IMarker.scopeKeys.forEach (k) ->
              keys[k] = scope[k]
            child = new MarkerChildModel(childScope, model, keys, @map, @DEFAULTS,
              @doClick, @gManager, doDrawSelf = false) #this is managed so child is not drawing itself
            @scope.plurals.put(model[@idKey], child) #major change this makes model.id a requirement
            child

          onDestroy: (scope) =>
            _async.promiseLock @, uiGmapPromise.promiseTypes.delete, undefined, undefined, =>
              _async.each @scope.plurals.values(), (model) =>
                model.destroy(false) if model?
              , _async.chunkSizeFrom(@scope.cleanchunk, false)
              .then =>
                delete @scope.plurals
                @gManager.clear() if @gManager?
                @scope.plurals = new PropMap()
                @scope.pluralsUpdate.updateCtr += 1

          maybeExecMappedEvent:(cluster, fnName) ->
            if _.isFunction @scope.clusterEvents?[fnName]
              pair = @mapClusterToPlurals cluster
              @origClusterEvents[fnName](pair.cluster,pair.mapped) if @origClusterEvents[fnName]

          mapClusterToPlurals:(cluster) ->
            mapped = cluster.getMarkers().map (g) =>
              @scope.plurals.get(g.key).model
            cluster: cluster
            mapped: mapped

          getItem: (scope, modelsPropToIterate, index) ->
            if modelsPropToIterate == 'models'
              return scope[modelsPropToIterate][index]
            scope[modelsPropToIterate].get index #otherwise it is a propMap

        return MarkersParentModel
]
