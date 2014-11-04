angular.module("uiGmapgoogle-maps.directives.api.utils")
.factory "uiGmapLinked", [ "uiGmapBaseObject", (BaseObject) ->
  class Linked extends BaseObject
    constructor: (scope, element, attrs, ctrls)->
      @scope = scope
      @element = element
      @attrs = attrs
      @ctrls = ctrls
  Linked
]
