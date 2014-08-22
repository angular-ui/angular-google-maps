###
	- interface directive for all window(s) to derive from
###
angular.module("google-maps.directives.api".ns())
.factory "IWindow".ns(), [ "BaseObject".ns(), "ChildEvents".ns(), "Logger".ns(), (BaseObject, ChildEvents, Logger) ->
  class IWindow extends BaseObject
    @include ChildEvents
    constructor: (@$timeout, @$compile, @$http, @$templateCache) ->
      @restrict = 'EMA'
      @template = undefined
      @transclude = true
      @priority = -100
      @require = '^' + 'GoogleMap'.ns()
      @replace = true
      @scope = {
        coords: '=coords',
        show: '=show',
        templateUrl: '=templateurl',
        templateParameter: '=templateparameter',
        isIconVisibleOnClick: '=isiconvisibleonclick',
        closeClick: '&closeclick', #scope glue to gmap InfoWindow closeclick
        options: '=options'
        control: '=control'
      }
      @$log = Logger

    link: (scope, element, attrs, ctrls) =>
      throw new Exception("Not Implemented!!")
]