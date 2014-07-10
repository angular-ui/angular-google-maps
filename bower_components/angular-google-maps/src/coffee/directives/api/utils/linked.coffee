angular.module("google-maps.directives.api.utils")
.factory "Linked", [ "BaseObject", (BaseObject) ->
    class Linked extends BaseObject
        constructor: (scope, element, attrs, ctrls)->
            @scope = scope
            @element = element
            @attrs = attrs
            @ctrls = ctrls
    Linked
]