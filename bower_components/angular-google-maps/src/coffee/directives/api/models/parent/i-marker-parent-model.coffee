###
	- interface for all markers to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- coords
 			- icon
		- implementation needed on watches
###
angular.module("google-maps.directives.api.models.parent")
.factory "IMarkerParentModel", ["ModelKey","Logger", (ModelKey, Logger) ->
    class IMarkerParentModel extends ModelKey
        DEFAULTS: {}
        constructor: (@scope, @element, @attrs, @mapCtrl, @$timeout) ->
            super(@scope)
            self = @
            @$log = Logger
            # Validate required properties
            throw new String("Unable to construct IMarkerParentModel due to invalid scope") unless @validateScope scope
            @doClick = angular.isDefined attrs.click
            if scope.options?
                @DEFAULTS = scope.options
            # Wrap marker initialization inside a $timeout() call to make sure the map is created already
            @$timeout =>
                @onTimeOut(scope)
                @watch('coords', @scope)
                @watch('icon', @scope)
                @watch('options', @scope)
                scope.$on "$destroy", =>
                    @onDestroy(scope)

        onTimeOut: (scope)=>
        validateScope: (scope)=>
            unless scope?
              @$log.error(@constructor.name + ": invalid scope used")
              return false
            ret = scope.coords?
            unless ret
                @$log.error(@constructor.name + ": no valid coords attribute found")
                return false
            ret

        watch: (propNameToWatch, scope) =>

            watchFunc = (newValue, oldValue) =>
                if (newValue != oldValue)
                    @onWatch(propNameToWatch, scope, newValue, oldValue)

            scope.$watch propNameToWatch, watchFunc, true

        onWatch: (propNameToWatch, scope, newValue, oldValue) =>
            throw new String("OnWatch Not Implemented!!")

        onDestroy: (scope) =>
            throw new String("OnDestroy Not Implemented!!")

        linkInit: (element, mapCtrl, scope, animate)=>
            throw new String("LinkInit Not Implemented!!")
    return IMarkerParentModel
]
