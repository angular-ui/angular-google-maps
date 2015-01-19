angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapIWindow', [
  'uiGmapBaseObject', 'uiGmapChildEvents', 'uiGmapCtrlHandle',
  (BaseObject, ChildEvents, CtrlHandle) ->
    class IWindow extends BaseObject
      IWindow.scope =
        coords: '=coords',
        template: '=template',
        templateUrl: '=templateurl',
        templateParameter: '=templateparameter',
        isIconVisibleOnClick: '=isiconvisibleonclick',
        closeClick: '&closeclick',
        options: '=options'
        control: '=control'
        show: '=show'
      IWindow.scopeKeys = _.keys(IWindow.scope)

      @include ChildEvents
      @extend CtrlHandle
      constructor:  ->
        @restrict = 'EMA'
        @template = undefined
        @transclude = true
        @priority = -100
        @require = '^' + 'uiGmapGoogleMap'
        @replace = true
        @scope = _.extend @scope or {}, IWindow.scope

]
