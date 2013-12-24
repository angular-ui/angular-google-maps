###
	- interface for all markers to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- coords
 			- icon
		- implementation needed on watches
###	
@ngGmapModule "directives.api", ->
	class @IMarker extends oo.BaseObject
		constructor: ($timeout) ->
			self = @
			@$log = directives.api.utils.Logger
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
				events: '=events'

		controller: ['$scope','$element', ($scope, $element) ->
			throw new Exception("Not Implemented!!")
		]
		link: (scope, element, attrs, ctrl) =>
			throw new Exception("Not implemented!!")