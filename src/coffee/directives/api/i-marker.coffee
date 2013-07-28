###
	- interface for all markers to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- coords
 			- icon
		- implementation needed on watches
###	
@module "directives.api", ->
	class @IMarker extends oo.BaseObject
		constructor: ($timeout) ->
			self = @
			@clsName = "IMarker"
			@$log = directives.api.utils.Logger
			@$timeout = $timeout
			@restrict = 'ECMA'
			@require = '^googleMap'
			@priority = -1
			@transclude = true
			@replace = true
			@scope = {
				coords: '=coords',
				icon: '=icon',
				click: '&click'
			}
		controller: ($scope, $element) ->
			throw new Exception("Not Implemented!!")
		link: (scope, element, attrs, ctrl) =>
			throw new Exception("Not implemented!!")