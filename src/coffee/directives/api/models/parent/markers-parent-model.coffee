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
            self = @
            @scope.markerModels = new PropMap()
            @scope.markerModelsUpdate =
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

            @gMarkerManager = undefined
            @createMarkersFromScratch(scope)


          onWatch: (propNameToWatch, scope, newValue, oldValue) =>
            if propNameToWatch == "idKey" and newValue != oldValue
              @idKey = newValue
            if @doRebuildAll
              @reBuildMarkers(scope)
            else
              @pieceMeal(scope)

          validateScope: (scope)=>
            modelsNotDefined = angular.isUndefined(scope.models) or scope.models == undefined
            if(modelsNotDefined)
              @$log.error(@constructor.name + ": no valid models attribute found")

            super(scope) or modelsNotDefined

          createMarkersFromScratch: (scope) =>
            if scope.doCluster
              if scope.clusterEvents
                @clusterInternalOptions = do _.once =>
                  self = @
                  unless @origClusterEvents
                    @origClusterEvents =
                      click: scope.clusterEvents?.click
                      mouseout: scope.clusterEvents?.mouseout
                      mouseover: scope.clusterEvents?.mouseover
                    _.extend scope.clusterEvents,
                      click:(cluster) ->
                        self.maybeExecMappedEvent cluster, 'click'
                      mouseout:(cluster) ->
                        self.maybeExecMappedEvent cluster, 'mouseout'
                      mouseover:(cluster) ->
                        self.maybeExecMappedEvent cluster, 'mouseover'

              if scope.clusterOptions or scope.clusterEvents
                if @gMarkerManager == undefined
                  @gMarkerManager = new ClustererMarkerManager @map,
                    undefined,
                    scope.clusterOptions,
                    @clusterInternalOptions
                else
                  if @gMarkerManager.opt_options != scope.clusterOptions
                    @gMarkerManager = new ClustererMarkerManager @map,
                      undefined,
                      scope.clusterOptions,
                      @clusterInternalOptions
              else
                @gMarkerManager = new ClustererMarkerManager @map
            else
              @gMarkerManager = new MarkerManager @map

            if scope.models.length == 0
              _async.waitOrGo @,
                _async.preExecPromise =>
                  promise = uiGmapPromise.resolve()
                  promise.promiseType = _async.promiseTypes.init
                  promise
              return

            #allows graceful fallout of _async.each
            maybeCanceled = null
            _async.waitOrGo @,
              _async.preExecPromise =>
                promise = _async.each scope.models, (model) =>
                  @newChildMarker(model, scope)
                  maybeCanceled
                .then =>
                  @modelsRendered = true
                  @gMarkerManager.draw()
                  @gMarkerManager.fit() if scope.fit
                  @scope.markerModelsUpdate.updateCtr += 1
                promise.promiseType = _async.promiseTypes.create
                promise
              , _async.promiseTypes.create
            , (canceledMsg) ->
              $log.debug "createAllNew: #{canceledMsg}"
              maybeCanceled= canceledMsg

          reBuildMarkers: (scope) =>
            if(!scope.doRebuild and scope.doRebuild != undefined)
              return
            if @scope.markerModels?.length
              @onDestroy(scope).then =>
                @createMarkersFromScratch(scope)
            else
              @createMarkersFromScratch(scope)

          pieceMeal: (scope) =>
            return if scope.$$destroyed or @isClearing
            #allows graceful fallout of _async.each
            maybeCanceled = null
            if @scope.models? and @scope.models.length > 0 and @scope.markerModels.length > 0 #and @scope.models.length == @scope.markerModels.length
              #find the current state, async operation that calls back
              payload = @figureOutState @idKey, scope, @scope.markerModels, @modelKeyComparison
              #payload contains added, removals and flattened (existing models with their gProp appended)
              #remove all removals clean up scope (destroy removes itself from markerManger), finally remove from @scope.markerModels

              _async.waitOrGo @,
                _async.preExecPromise =>
                  promise = _async.each payload.removals, (child) =>
                    if child?
                      child.destroy() if child.destroy?
                      @scope.markerModels.remove(child.id)
                      maybeCanceled
                  .then =>
                      #add all adds via creating new ChildMarkers which are appended to @scope.markerModels
                    _async.each payload.adds, (modelToAdd) =>
                      @newChildMarker(modelToAdd, scope)
                      maybeCanceled
                  .then () =>
                    _async.each payload.updates, (update) =>
                      @updateChild update.child, update.model
                      maybeCanceled
                  .then =>
                    #finally redraw if something has changed
                    if(payload.adds.length > 0 or payload.removals.length > 0 or payload.updates.length > 0)
                      @gMarkerManager.draw()
                      scope.markerModels = @scope.markerModels #for other directives like windows
                      @gMarkerManager.fit() if scope.fit #note fit returns a promise
                    @scope.markerModelsUpdate.updateCtr += 1
                  promise.promiseType = _async.promiseTypes.update
                  promise
                , _async.promiseTypes.update
              , (canceledMsg) ->
                $log.debug "pieceMeal: #{canceledMsg}"
                maybeCanceled = canceledMsg

            else
              @inProgress = false
              @reBuildMarkers(scope)

          updateChild:(child, model) =>
            unless model[@idKey]?
              @$log.error("Marker model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.")
              return
            #set isInit to true to force redraw after all updates are processed
            child.updateModel model

          newChildMarker: (model, scope)=>
            unless model[@idKey]?
              @$log.error("Marker model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.")
              return
            @$log.info('child', child, 'markers', @scope.markerModels)
            childScope = scope.$new(true)
            childScope.events = scope.events
            keys = {}
            _.each IMarker.scopeKeys, (v,k) ->
              keys[k] = scope[k]
            child = new MarkerChildModel(childScope, model, keys, @map, @DEFAULTS,
              @doClick, @gMarkerManager, doDrawSelf = false) #this is managed so child is not drawing itself
            @scope.markerModels.put(model[@idKey], child) #major change this makes model.id a requirement
            child

          onDestroy: (scope)=>
            #slap index to the external model so that when they pass external back
            @destroyPromise().then =>
              _async.waitOrGo @,
                _async.preExecPromise =>
                  promise = _async.each @scope.markerModels.values(), (model) =>
                    model.destroy(false) if model?
                  .then =>
                    delete @scope.markerModels
                    @gMarkerManager.clear() if @gMarkerManager?
                    @scope.markerModels = new PropMap()
                    @scope.markerModelsUpdate.updateCtr += 1
                    @isClearing = false
                  promise.promiseType =  _async.promiseTypes.delete
                  promise
                , _async.promiseTypes.delete

          maybeExecMappedEvent:(cluster, fnName) ->
            if _.isFunction @scope.clusterEvents?[fnName]
              pair = @mapClusterToMarkerModels cluster
              @origClusterEvents[fnName](pair.cluster,pair.mapped) if @origClusterEvents[fnName]

          mapClusterToMarkerModels:(cluster) ->
            mapped = cluster.getMarkers().map (g) =>
              @scope.markerModels.get(g.key).model
            cluster: cluster
            mapped: mapped

          getItem: (scope, modelsPropToIterate, index) ->
            if modelsPropToIterate == 'models'
              return scope[modelsPropToIterate][index]
            scope[modelsPropToIterate].get index #otherwise it is a propMap

        return MarkersParentModel
]
