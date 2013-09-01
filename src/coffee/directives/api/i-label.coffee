###
	- interface for all labels to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- content
 			- anchor
		- implementation needed on watches
###	
@ngGmapModule "directives.api", ->
	class @ILabel extends oo.BaseObject
		constructor: ($timeout) ->
			self = @
			@restrict= 'ECMA'
			@template= undefined
			@transclude= true
			@priority= -100
			@require = [ '^googleMap', '^marker' ]
			@scope= {
				labelContent: '=content',
				labelAnchor: '@anchor',
				labelClass: '@class',
				labelStyle: '=style'
			}
			@$log = directives.api.utils.Logger
			@$timeout = $timeout
		link: (scope, element, attrs, ctrls) =>
			throw new Exception("Not Implemented!!")