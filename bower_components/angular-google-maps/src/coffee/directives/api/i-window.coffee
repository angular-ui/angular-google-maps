###
	- interface directive for all window(s) to derrive from
###
angular.module("google-maps.directives.api")
.factory "IWindow",[ "BaseObject","ChildEvents", "Logger", (BaseObject, ChildEvents, Logger) ->
    class IWindow extends BaseObject
        @include ChildEvents
        constructor: (@$timeout, @$compile, @$http, @$templateCache) ->
            self = @
            @restrict = 'ECMA'
            @template = undefined
            @transclude = true
            @priority = -100
            @require = undefined
            @replace = true
            @scope = {
                coords: '=coords',
                show: '=show',
                templateUrl: '=templateurl',
                templateParameter: '=templateparameter',
                isIconVisibleOnClick: '=isiconvisibleonclick',
                closeClick: '&closeclick', #scope glue to gmap InfoWindow closeclick
                options: '=options'
            }
            @$log = Logger

        link: (scope, element, attrs, ctrls) =>
            throw new Exception("Not Implemented!!")
]