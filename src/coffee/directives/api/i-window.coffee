###
	- interface directive for all window(s) to derrive from
###	
@module "directives.api", ->
	class @IWindow extends oo.BaseObject
		@include directives.api.utils.GmapUtil
		# Animation is enabled by default
		DEFAULTS: {}

		constructor: ($log, $timeout, $compile, $http, $templateCache) ->
			self = @
			@clsName = "IWindow"
			@restrict= 'ECMA'
			@template= undefined
			@transclude= true
			@priority= -100
			@require = undefined
			@scope= {
				coords: '=coords',
				show: '&show',
				templateUrl: '=templateurl',
				templateParameter: '=templateparameter',
				isIconVisibleOnClick: '=isiconvisibleonclick',
				closeClick: '&closeclick'           #scope glue to gmap InfoWindow closeclick
			}
			@$log = $log
			@$timeout = $timeout
			@$compile = $compile
			@$http = $http
			@$templateCache = $templateCache

		link: (scope, element, attrs, ctrls) =>
			throw new Exception("Not Implemented!!")