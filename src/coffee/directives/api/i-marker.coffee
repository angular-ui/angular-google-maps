###
	- interface for all markers to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- coords
 			- icon
		- implementation needed on watches
###
angular.module("google-maps.directives.api".ns())
.factory "IMarker".ns(), [ "Logger".ns(), "BaseObject".ns(), "CtrlHandle".ns(), (Logger, BaseObject, CtrlHandle)->
  class IMarker extends BaseObject

    IMarker.keys =
      coords: '=coords'
      icon: '=icon'
      click: '&click'
      options: '=options'
      events: '=events'
      fit: '=fit'
      idKey: '=idkey' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
      control: '=control'

    @extend CtrlHandle
    constructor: ->
      @$log = Logger
      @restrict = 'EMA'
      @require = '^' + 'GoogleMap'.ns()
      @priority = -1
      @transclude = true
      @replace = true
      @scope = IMarker.keys


    link: (scope, element, attrs, ctrl) =>
      throw new Error "No Map Control! Marker Directive Must be inside the map!" unless ctrl
]

