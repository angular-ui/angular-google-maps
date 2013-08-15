@ngGmapModule "directives.api.utils", ->
	class @Linked extends oo.BaseObject
		constructor:(scope, element, attrs, ctrls)->
			@scope = scope
			@element = element
			@attrs = attrs
			@ctrls = ctrls