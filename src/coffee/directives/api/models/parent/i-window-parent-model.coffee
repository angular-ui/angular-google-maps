###
	- interface directive for all window(s) to derrive from
###	
@ngGmapModule "directives.api.models.parent", ->
	class @IWindowParentModel extends oo.BaseObject
		@include directives.api.utils.GmapUtil
		# Animation is enabled by default
		DEFAULTS: {}

		constructor: (scope, element, attrs, ctrls,$timeout, $compile, $http, $templateCache) ->
			self = @
			@clsName = "directives.api.models.parent.IWindow"
			@$log = directives.api.utils.Logger
			@$timeout = $timeout
			@$compile = $compile
			@$http = $http
			@$templateCache = $templateCache