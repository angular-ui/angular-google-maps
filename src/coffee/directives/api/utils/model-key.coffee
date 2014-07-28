angular.module("google-maps.directives.api.utils")
.factory "ModelKey", ["BaseObject", "GmapUtil", (BaseObject, GmapUtil) ->
    class ModelKey extends BaseObject
        constructor: (@scope) ->
            super()
            @defaultIdKey = "id"
            @idKey = undefined

        evalModelHandle: (model, modelKey) ->
            if model == undefined or modelKey == undefined
                return undefined
            if modelKey == 'self'
                model
            else #modelKey may use dot-notation
                GmapUtil.getPath(model, modelKey)

        modelKeyComparison: (model1, model2) =>
            scope = if @scope.coords? then @scope else @parentScope
            if not scope? then throw "No scope or parentScope set!"
            GmapUtil.equalCoords @evalModelHandle(model1, scope.coords), 
                    @evalModelHandle(model2, scope.coords)

        setIdKey:(scope) =>
            @idKey = if scope.idKey? then scope.idKey else @defaultIdKey

        setVal: (model,key,newValue) ->
          thingToSet = @modelOrKey model,key
          thingToSet = newValue
          model

        modelOrKey: (model,key) ->
          thing = if key != 'self' then model[key] else model
          thing
]
