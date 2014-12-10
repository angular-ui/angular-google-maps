angular.module('uiGmapgoogle-maps.directives.api.utils')
.factory 'uiGmapModelsWatcher', [
  'uiGmapLogger', 'uiGmap_async', '$q', 'uiGmapPromise',
  (Logger,_async, $q, uiGmapPromise) ->
    # make sure that we don't trigger map updates too often. some events
    # can be triggered a lot which could stall whole app
    updateInProgress: () =>
      now = new Date()
      # two map updates can happen at least 250ms apart
      delta = now - @lastUpdate
      if delta <= 250 or @inProgress
        return true
      @inProgress = true
      @lastUpdate = now
      return false

    didQueueInitPromise:(existingPiecesObj, scope) ->
      if scope.models.length == 0
        _async.waitOrGo existingPiecesObj,
          _async.preExecPromise(->
            promise = uiGmapPromise.resolve()
            promise.promiseType = _async.promiseTypes.init
            promise
          , _async.promiseTypes.init)
        return true
      false


    figureOutState: (idKey, scope, childObjects, comparison, callBack)->
      adds = [] #models to add or update
      mappedScopeModelIds = {}
      removals = [] #childModels to remove
      updates = []
      scope.models.forEach (m) ->
        if m[idKey]?
          mappedScopeModelIds[m[idKey]] = {}
          unless childObjects.get(m[idKey])?
            adds.push m
          else
            child = childObjects.get(m[idKey])
            #we're UPDATE in this case
            unless comparison m, child.clonedModel
              updates.push
                model: m
                child: child
        else
          Logger.error ''' id missing for model #{m.toString()},
            can not use do comparison/insertion'''
      children = childObjects.values()
      children.forEach (c) ->
        unless c?
          Logger.error('child undefined in ModelsWatcher.')
          return
        unless c.model?
          Logger.error('child.model undefined in ModelsWatcher.')
          return
        id = c.model[idKey]
        #if we do not have the object we can remove it,
        #this case is when it no longer exists and should be removed
        removals.push c unless mappedScopeModelIds[id]?

      adds: adds
      removals: removals
      updates: updates
]