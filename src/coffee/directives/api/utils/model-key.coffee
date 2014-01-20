@ngGmapModule "directives.api.utils", ->
    class @ModelKey extends oo.BaseObject
        constructor:(@scope) ->
            super()
            @defaultIdKey= "id"
            @idKey = undefined

        evalModelHandle: (model, modelKey) ->
            if model == undefined
                return undefined
            if modelKey == 'self'
                model
            else
                model[modelKey]

        modelKeyComparison: (model1, model2) =>
            @evalModelHandle(model1, @scope.coords).latitude == @evalModelHandle(model2,
                    @scope.coords).latitude and
            @evalModelHandle(model1, @scope.coords).longitude == @evalModelHandle(model2,
                    @scope.coords).longitude

