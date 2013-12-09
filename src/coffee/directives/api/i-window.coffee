###
	- interface directive for all window(s) to derrive from
###
@ngGmapModule "directives.api", ->
    class @IWindow extends oo.BaseObject
        @include directives.api.utils.ChildEvents
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
            @$log = directives.api.utils.Logger

        link: (scope, element, attrs, ctrls) =>
            throw new Exception("Not Implemented!!")