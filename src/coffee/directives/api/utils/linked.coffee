angular.module("google-maps.directives.api.utils".ns())
.factory "Linked".ns(), [ "BaseObject".ns(), (BaseObject) ->
  class Linked extends BaseObject
    constructor: (scope, element, attrs, ctrls)->
      @scope = scope
      @element = element
      @attrs = attrs
      @ctrls = ctrls
  Linked
]