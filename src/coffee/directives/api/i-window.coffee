###
	- interface directive for all window(s) to derive from
###
angular.module("google-maps.directives.api".ns())
.factory "IWindow".ns(), [ "BaseObject".ns(), "ChildEvents".ns(), "Logger".ns(), (BaseObject, ChildEvents, Logger) ->
  class IWindow extends BaseObject
    @include ChildEvents
    constructor:  ->
      @restrict = 'EMA'
      @template = undefined
      @transclude = true
      @priority = -100
      @require = '^' + 'GoogleMap'.ns()
      @replace = true
      @scope = {
        coords: '=coords',
        template: '=template',
        templateUrl: '=templateurl',
        templateParameter: '=templateparameter',
        isIconVisibleOnClick: '=isiconvisibleonclick',
        closeClick: '&closeclick', #scope glue to gmap InfoWindow closeclick
        options: '=options'
        control: '=control'
        #show is not part of options, (https://developers.google.com/maps/documentation/javascript/reference#InfoWindowOptions) we need it then
        show: '=show'
      }
      @$log = Logger

    link: (scope, element, attrs, ctrls) =>
      throw new Exception("Not Implemented!!")
]