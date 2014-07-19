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
        @restrict = 'EMA'
        @require = '^googleMap'
        @priority = -1
        @transclude = true
        @replace = true
        @scope =
          coords: '='
          icon: '='
          click: '&click'
          options: '='
          events: '='
          fit: '='
          idKey: '=' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
          control: '='

      controller: ['$scope', '$element', ($scope, $element) ->
        throw new Exception("Not Implemented!!")
      ]
      link: (scope, element, attrs, ctrl) =>
        throw new Exception("Not implemented!!")
  ]
