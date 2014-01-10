@ngGmapModule "directives.api.utils", ->
    @ModelsWatcher =
        didModelsChange: (newValue, oldValue) ->
            return false if newValue is undefined
            unless _.isArray(newValue)
                directives.api.utils.Logger.error("models property must be an array newValue of: #{newValue.toString()} is not!!")
                return false
            if newValue == oldValue #isSameReference?
                return false
            hasIntersectionDiff = _.intersectionObjects(newValue, oldValue).length != oldValue.length
            didModelsChange = true
            unless hasIntersectionDiff # we could have same intersection with aditional markers on top
                didModelsChange = newValue.length != oldValue.length
            didModelsChange

        #putting a payload together in order to not have to flatten twice, and to not have to flatten again later
        modelsToAddRemovePayload: (scope, childObjects, comparison, gPropToPass)->
            childModels = @getChildModels(childObjects,gPropToPass)
            flattened: childModels
            adds: _.differenceObjects(scope.models, childModels, comparison)
            removals: _.differenceObjects(childModels, scope.models, comparison)

        getChildModels: (childObjects, gPropToPass, $idPropName) ->
            _.map childObjects, (child) ->
                child.model.$id = child.$id #need some way of getting back to child later to remove it
                child.model[gPropToPass] = child[gPropToPass] #passing some gObject, maybe gMarker, maybe gWindow, using class will use reference to be cleaned
                child.model