###
	- interface for all markers to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- coords
 			- icon
		- implementation needed on watches
###
angular.module("google-maps.directives.api")
.factory "IMarker", [ "Logger", "BaseObject", (Logger, BaseObject)->
    class IMarker extends BaseObject
      constructor: ($timeout) ->
        self = @
        @$log = Logger
        @$timeout = $timeout
        @restrict = 'ECMA'
        @require = '^googleMap'
        @priority = -1
        @transclude = true
        @replace = true
        @scope =
          coords: '=coords',
          icon: '=icon',
          click: '&click',
          options: '=options',
          events: '=events',
          fit: '=fit'

      controller: ['$scope', '$element', ($scope, $element) ->
        throw new Exception("Not Implemented!!")
      ]
      link: (scope, element, attrs, ctrl) =>
        throw new Exception("Not implemented!!")
  ]
