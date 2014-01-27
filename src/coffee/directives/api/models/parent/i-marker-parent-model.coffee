###
	- interface for all markers to derrive from
 	- to enforce a minimum set of requirements
 		- attributes
 			- coords
 			- icon
		- implementation needed on watches
###
@ngGmapModule "directives.api.models.parent", ->
    class @IMarkerParentModel extends oo.BaseObject
        DEFAULTS: {}

        # Check if a value is literally false
        # @param value the value to test
        # @returns {boolean} true if value is literally false, false otherwise
        isFalse: (value) ->
            ['false', 'FALSE', 0, 'n', 'N', 'no', 'NO'].indexOf(value) != -1

        constructor: (@scope, @element, @attrs, @mapCtrl, @$timeout) ->
            self = @
            @$log = directives.api.utils.Logger
            # Validate required properties
            return unless @validateScope scope
            @doClick = angular.isDefined attrs.click
            if scope.options?
                @DEFAULTS = scope.options
            # Wrap marker initialization inside a $timeout() call to make sure the map is created already
            @$timeout =>
                @watch('coords', scope)
                @watch('icon', scope)
                @watch('options', scope)
                @onTimeOut(scope)
                scope.$on "$destroy", =>
                    @onDestroy(scope)

        onTimeOut: (scope)=>
        validateScope: (scope)=>
            return false unless scope?
            ret = scope.coords?
            unless ret
                @$log.error(@constructor.name + ": no valid coords attribute found")
            ret

        watch: (propNameToWatch, scope) =>
            scope.$watch(propNameToWatch, (newValue, oldValue) =>
                if (newValue != oldValue)
                    @onWatch(propNameToWatch, scope, newValue, oldValue)
            , true)

        onWatch: (propNameToWatch, scope, newValue, oldValue) =>
            throw new Exception("Not Implemented!!")

        onDestroy: (scope) =>
            throw new Exception("Not Implemented!!")

        linkInit: (element, mapCtrl, scope, animate)=>
            throw new Exception("Not Implemented!!")