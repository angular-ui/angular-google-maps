###
 - interface for all controls to derive from
 - to enforce a minimum set of requirements
	- attributes
		- template
		- position
		- controller
		- index
###
angular.module("google-maps.directives.api".ns())
.factory "IControl".ns(), [ "BaseObject".ns(), "Logger".ns(), "CtrlHandle".ns(), (BaseObject, Logger, CtrlHandle) ->
  class IControl extends BaseObject
    @extend CtrlHandle
    constructor: ->
      @restrict = 'EA'
      @replace = true
      @require = '^' + 'GoogleMap'.ns()
      @scope =
        template: '@template'
        position: '@position'
        controller: '@controller'
        index: '@index'
      @$log = Logger

    link: (scope, element, attrs, ctrl) =>
      throw new Exception("Not implemented!!")
]
