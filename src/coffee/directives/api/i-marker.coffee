angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapIMarker', [ 'uiGmapBaseObject', 'uiGmapCtrlHandle',
 (BaseObject, CtrlHandle)->
    class IMarker extends BaseObject

      IMarker.scope =
        coords: '=coords'
        icon: '=icon'
        click: '&click'
        options: '=options'
        events: '=events'
        fit: '=fit'
        idKey: '=idkey'
        control: '=control'

      IMarker.scopeKeys = _.keys(IMarker.scope)
      IMarker.keys = IMarker.scopeKeys

      @extend CtrlHandle
      constructor: ->
        @restrict = 'EMA'
        @require = '^' + 'uiGmapGoogleMap'
        @priority = -1
        @transclude = true
        @replace = true
        @scope = _.extend @scope or {}, IMarker.scope
]
