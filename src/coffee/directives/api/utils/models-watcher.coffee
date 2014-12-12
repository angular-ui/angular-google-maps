angular.module('uiGmapgoogle-maps.directives.api.utils')
.factory 'uiGmapModelsWatcher', [
  'uiGmapLogger', 'uiGmap_async', '$q', 'uiGmapPromise',
  (Logger,_async, $q, uiGmapPromise) ->

    didQueueInitPromise:(existingPiecesObj, scope) ->
      if scope.models.length == 0
        _async.promiseLock existingPiecesObj, uiGmapPromise.promiseTypes.init, null , null, (=> uiGmapPromise.resolve())
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