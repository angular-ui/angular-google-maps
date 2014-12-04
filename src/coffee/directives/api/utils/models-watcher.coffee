angular.module('uiGmapgoogle-maps.directives.api.utils')
.factory 'uiGmapModelsWatcher', [
  'uiGmapLogger', 'uiGmap_async', '$q',
  (Logger,_async, $q) ->
    #putting a payload together in order to not have to flatten twice, and to not
    #have to flatten again later
    cancelable = (promise) ->
      cancelDeferred = $q.defer()
      combined = $q.all [promise, cancelDeferred.promise]
      wrapped = $q.defer()

      promise.then  (result) ->
        cancelDeferred.resolve()

      combined.then (results) ->
        wrapped.resolve results[0]
      , wrapped.reject

      wrapped.promise.cancel = (reason) ->
        reason = reason or 'canceled'
        cancelDeferred.reject reason

      wrapped.promise

    onlyTheLast = do ->
      promises = []
      (p, cb) ->
        promise = cancelable p
        promises.push promise
        promise.then (value) ->
          if promise is _.last promises
            if promises.length >= 2
              promises.forEach (promise, i) ->
                if i < promises.length - 1
                  promise.cancel()
            cb value
            promises = []

    figureOutState: (idKey, scope, childObjects, comparison, callBack)->
      adds = [] #models to add or update
      mappedScopeModelIds = {}
      removals = [] #childModels to remove
      updates = []
      onlyTheLast (
        _async.each scope.models, (m) ->
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
        .then =>
          _async.each childObjects.values(), (c) ->
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
          .then =>
            adds: adds
            removals: removals
            updates: updates
      ), callBack
]
