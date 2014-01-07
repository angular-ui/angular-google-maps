@ngGmapModule "directives.api.utils", ->
    @ModelKey =
        evalModelHandle:(model,modelKey) ->
            if model == undefined
                return undefined
            if modelKey == 'self'
                model
            else
                model[modelKey]


        #TODO: allow comparison to be overriden in attributes / scope
        modelKeyComparison: (model1,model2) ->
            @evalModelHandle(model1,scope.coords).latitude == @evalModelHandle(model2,scope.coords).latitude and
            @evalModelHandle(model1,scope.icon) == @evalModelHandle(model2,scope.icon) and
            @evalModelHandle(model1,scope.options) == @evalModelHandle(model2,scope.options)