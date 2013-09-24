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
			@replace = true
			@template= undefined
			@require= undefined
			@transclude= true
			@priority= -100
			@scope= {
				labelContent: '=content',
				labelAnchor: '@anchor',
				labelClass: '@class',
				labelStyle: '=style'
			}
			@$log = directives.api.utils.Logger
			@$timeout = $timeout
		link: (scope, element, attrs, ctrl) =>
			throw new Exception("Not Implemented!!")