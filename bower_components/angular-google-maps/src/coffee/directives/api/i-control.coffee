###
 - interface for all controls to derive from
 - to enforce a minimum set of requirements
	- attributes
		- template
		- position
		- controller
		- index
###
angular.module("google-maps.directives.api")
.factory "IControl", [ "BaseObject", "Logger", "CtrlHandle",
  (BaseObject, Logger, CtrlHandle) ->
    class IControl extends BaseObject
      @extend CtrlHandle
      constructor: ->
        @restrict = 'EA'
        @replace = true
        @require = '^googleMap'
        @scope =
          template: '@template'
          position: '@position'
          controller: '@controller'
          index: '@index'
        @$log = Logger

      link: (scope, element, attrs, ctrl) =>
        throw new Exception("Not implemented!!")
]
