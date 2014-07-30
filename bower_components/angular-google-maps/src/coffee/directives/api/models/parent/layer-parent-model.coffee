angular.module("google-maps.directives.api.models.parent")
.factory "LayerParentModel", ["BaseObject", "Logger", '$timeout',(BaseObject, Logger,$timeout) ->
    class LayerParentModel extends BaseObject
        constructor: (@scope, @element, @attrs, @gMap, @onLayerCreated = undefined, @$log = Logger) ->
            unless @attrs.type?
                @$log.info("type attribute for the layer directive is mandatory. Layer creation aborted!!")
                return
            @createGoogleLayer()
            @doShow = true

            @doShow = @scope.show  if angular.isDefined(@attrs.show)
            @layer.setMap @gMap  if @doShow and @gMap?
            @scope.$watch("show", (newValue, oldValue) =>
                if newValue isnt oldValue
                    @doShow = newValue
                    if newValue
                        @layer.setMap @gMap
                    else
                        @layer.setMap null
            , true)
            @scope.$watch("options", (newValue, oldValue) =>
                if newValue isnt oldValue
                    @layer.setMap null
                    @layer = null
                    @createGoogleLayer()
            , true)
            @scope.$on "$destroy", =>
                @layer.setMap null

        createGoogleLayer: ()=>
            unless @attrs.options?
                @layer = if @attrs.namespace == undefined then new google.maps[@attrs.type]()
                else new google.maps[@attrs.namespace][@attrs.type]()
            else
                @layer = if@attrs.namespace == undefined then new google.maps[@attrs.type](@scope.options)
                else new google.maps[@attrs.namespace][@attrs.type](@scope.options)

            if @layer? and @onLayerCreated?
                fn = @onLayerCreated(@scope, @layer)
                if fn
                    fn(@layer)
    LayerParentModel
]
