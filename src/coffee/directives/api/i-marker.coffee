###
	- interface for all markers to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- coords
 			- icon
		- implementation needed on watches
###
angular.module("google-maps.directives.api")
.factory "IMarker", [ "Logger", "BaseObject", "$q", (Logger, BaseObject, $q)->
  class IMarker extends BaseObject
    constructor: ($timeout) ->
      self = @
      @$log = Logger
      @$timeout = $timeout
      @restrict = 'ECMA'
      @require = '^googleMap'
      @priority = -1
      @transclude = true
      @replace = true
      @scope =
        coords: '=coords',
        icon: '=icon',
        click: '&click',
        options: '=options',
        events: '=events',
        fit: '=fit'

    link: (scope, element, attrs, ctrl) =>
      throw new Error "No Map Control! Marker Directive Must be inside the map!" unless ctrl

    mapPromise: (scope, ctrl) ->
      mapScope = ctrl.getScope()
      mapScope.deferred.promise.then (map) ->
        scope.map = map
      mapScope.deferred.promise
]

