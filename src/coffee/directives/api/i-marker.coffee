###
	- interface for all markers to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- coords
 			- icon
		- implementation needed on watches
###
angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapIMarker', [ 'uiGmapLogger', 'uiGmapBaseObject', 'uiGmapCtrlHandle',
 (Logger, BaseObject, CtrlHandle)->
    class IMarker extends BaseObject

      IMarker.scopeKeys =
        coords: '=coords'
        icon: '=icon'
        click: '&click'
        options: '=options'
        events: '=events'
        fit: '=fit'
        idKey: '=idkey'
        control: '=control'

      IMarker.keys = _.keys IMarker.scopeKeys

      @extend CtrlHandle
      constructor: ->
        @$log = Logger
        @restrict = 'EMA'
        @require = '^' + 'uiGmapGoogleMap'
        @priority = -1
        @transclude = true
        @replace = true
        @scope = IMarker.scopeKeys
]
