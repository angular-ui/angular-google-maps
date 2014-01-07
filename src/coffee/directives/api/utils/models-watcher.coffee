@ngGmapModule "directives.api.utils", ->
    @ModelsWatcher =
        didModelsChange: (newValue, oldValue) ->
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

        #get the models that have been added since we last looked
        findModelsToAdd: (scope, childObjects)->
            childModels = getChildModels(childObjects)
            _.differenceObjects(scope.models, childModels)

        #get the models that have been removed since we last looked
        findModelsToRemove: (scope, childObjects)->
            childModels = getChildModels(childObjects)
            _.differenceObjects(childModels, scope.models)

        getChildModels: (childObjects) ->
            _.map childObjects, (child) ->
                child.model