angular.module("google-maps.directives.api.utils")
.factory "ModelsWatcher",[ "Logger", (Logger) ->
    #putting a payload together in order to not have to flatten twice, and to not have to flatten again later
    figureOutState: (idKey, scope, childObjects, comparison, callBack)->
        adds = [] #models to add or update
        mappedScopeModelIds = {}
        removals = [] #childModels to remove
        _async.each scope.models, (m) ->
            if m[idKey]?
                mappedScopeModelIds[m[idKey]] = {}
                unless childObjects[m[idKey]]?
                    adds.push m
                else
                    child = childObjects[m[idKey]]
                    #we're UPDATE in this case
                    unless comparison m, child.model
                        adds.push m
                        removals.push child
            else
                Logger.error("id missing for model #{m.toString()}, can not use do comparison/insertion")
        , () =>
            _async.each childObjects.values(), (c) ->
                unless c?
                    Logger.error("child undefined in ModelsWatcher.")
                    return
                unless c.model?
                    Logger.error("child.model undefined in ModelsWatcher.")
                    return
                id = c.model[idKey]
                #if we do not have the object we can remove it, this case is when it no longer exists and should be removed
                removals.push c unless mappedScopeModelIds[id]?
            , () =>
                callBack
                    adds: adds
                    removals: removals
]
