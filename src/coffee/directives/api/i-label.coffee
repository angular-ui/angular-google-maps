###
	- interface for all labels to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- content
 			- anchor
		- implementation needed on watches
###
angular.module("google-maps.directives.api")
.factory "ILabel", [ "BaseObject", "Logger", (BaseObject, Logger) ->
    class ILabel extends BaseObject
        constructor: ($timeout) ->
            self = @
            @restrict = 'ECMA'
            @replace = true
            @template = undefined
            @require = undefined
            @transclude = true
            @priority = -100
            @scope = {
                labelContent: '=content',
                labelAnchor: '@anchor',
                labelClass: '@class',
                labelStyle: '=style'
            }
            @$log = Logger
            @$timeout = $timeout
        link: (scope, element, attrs, ctrl) =>
            throw new Exception("Not Implemented!!")
]