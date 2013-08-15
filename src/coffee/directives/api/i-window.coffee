###
	- interface directive for all window(s) to derrive from
###	
@ngGmapModule "directives.api", ->
	class @IWindow extends oo.BaseObject
		constructor: ($timeout, $compile, $http, $templateCache) ->
			self = @
			@clsName = "IWindow"
			@restrict= 'ECMA'
			@template= undefined
			@transclude= true
			@priority= -100
			@require = undefined
			@scope= {
				coords: '=coords',
				show: '=show',
				templateUrl: '=templateurl',
				templateParameter: '=templateparameter',
				isIconVisibleOnClick: '=isiconvisibleonclick',
				closeClick: '&closeclick'           #scope glue to gmap InfoWindow closeclick
			}
			@$log = directives.api.utils.Logger
			@$timeout = $timeout
			@$compile = $compile
			@$http = $http
			@$templateCache = $templateCache

		link: (scope, element, attrs, ctrls) =>
			throw new Exception("Not Implemented!!")