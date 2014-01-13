@ngGmapModule "directives.api.utils", ->
    @ModelsWatcher =
        didModelsChange: (newValue, oldValue, comparison) ->
            return false if newValue is undefined
            unless _.isArray(newValue)
                directives.api.utils.Logger.error("models property must be an array newValue of: #{newValue.toString()} is not!!")
                return false
            if newValue == oldValue #isSameReference?
                return false
            interObjects = _.intersectionObjects(newValue, oldValue, comparison)
            hasIntersectionDiff = interObjects.length != oldValue.length
            didModelsChange = true
            unless hasIntersectionDiff # we could have same intersection with aditional markers on top
                didModelsChange = newValue.length != oldValue.length
            didModelsChange

        #putting a payload together in order to not have to flatten twice, and to not have to flatten again later
        modelsToAddRemovePayload: (scope, childObjects, comparison, gPropToPass)->
            childModels = @getChildModels(childObjects, gPropToPass)
            flattened: childModels
            adds: _.differenceObjects(scope.models, childModels, comparison)
            removals: _.differenceObjects(childModels, scope.models, comparison)

        getChildModels: (childObjects) ->
#            index = 0
            _.map childObjects, (child) ->
#                child.model.index = index
#                index = 1 + index
                child.model.$id = child.$id #need some way of getting back to child later to remove it
                child.model


        transformModels: (scope, modelsPropToIterate,isArray = true) ->
            toRender = scope[modelsPropToIterate]
            toRender = if isArray then toRender else _.values toRender