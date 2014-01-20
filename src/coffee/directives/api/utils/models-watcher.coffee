@ngGmapModule "directives.api.utils", ->
    @ModelsWatcher =
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
                        unless comparison m, child
                            adds.push m
                            removals.push child
                else
                    directives.api.utils.Logger.error("id missing for model #{m.toString()}, can not use do comparison/insertion")
            , () =>
                _async.each childObjects, (c) ->
                    removals.push c.id unless mappedScopeModelIds[c.id]?
                        #if we done have the object we can remove it
                , () =>
                    callBack
                        adds: adds
                        removals: removals