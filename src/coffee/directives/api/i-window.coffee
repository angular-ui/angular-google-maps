###
	- interface directive for all window(s) to derrive from
###
angular.module("google-maps.directives.api")
.factory "IWindow",[ "BaseObject","ChildEvents", "Logger", (BaseObject, ChildEvents, Logger) ->
    class IWindow extends BaseObject
        @include ChildEvents
        constructor: (@$timeout, @$compile, @$http, @$templateCache) ->
            self = @
            @restrict = 'EMA'
            @template = undefined
            @transclude = true
            @priority = -100
            @require = undefined
            @replace = true
            @scope = {
                coords: '=',
                show: '=',
                templateUrl: '=',
                templateParameter: '=',
                isIconVisibleOnClick: '=',
                closeClick: '&closeclick', #scope glue to gmap InfoWindow closeclick
                options: '='
                control: '='
            }
            @$log = Logger

        link: (scope, element, attrs, ctrls) =>
            throw new Exception("Not Implemented!!")
]