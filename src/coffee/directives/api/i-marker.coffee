###
	- interface for all markers to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- coords
 			- icon
		- implementation needed on watches
###
angular.module("google-maps.directives.api")
.factory "IMarker", [ "Logger", "BaseObject", "CtrlHandle", (Logger, BaseObject, CtrlHandle)->
  class IMarker extends BaseObject
    @extend CtrlHandle
    constructor: ->
      @$log = Logger
      @restrict = 'EMA'
      @require = '^googleMap'
      @priority = -1
      @transclude = true
      @replace = true
      @scope =
        coords: '=coords'
        icon: '=icon'
        click: '&click'
        options: '=options'
        events: '=events'
        fit: '=fit'
        idKey: '=idkey' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
        control: '=control'

    link: (scope, element, attrs, ctrl) =>
      throw new Error "No Map Control! Marker Directive Must be inside the map!" unless ctrl
]

