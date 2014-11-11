###
	- interface directive for all window(s) to derive from
###
angular.module("uiGmapgoogle-maps.directives.api")
.factory "uiGmapIWindow", [
  "uiGmapBaseObject", "uiGmapChildEvents", "uiGmapLogger", "uiGmapCtrlHandle",
  (BaseObject, ChildEvents, Logger, CtrlHandle) ->
    class IWindow extends BaseObject
      @include ChildEvents
      @extend CtrlHandle
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
]
