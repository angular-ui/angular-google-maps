angular.module("google-maps.directives.api.utils")
.factory "ModelsWatcher",[ "Logger", (Logger) ->
    ModelsWatcher =
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
                        #we're update in this case
                        unless comparison m, child.model
                            adds.push m
                            removals.push child.model
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
                    removals.push c.model[idKey] unless mappedScopeModelIds[id]?
                        #if we done have the object we can remove it
                , () =>
                    callBack
                        adds: adds
                        removals: removals
    ModelsWatcher
]