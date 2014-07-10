###
	- interface directive for all window(s) to derrive from
###
angular.module("google-maps.directives.api.models.parent")
.factory "IWindowParentModel", ["ModelKey", "GmapUtil", "Logger",(ModelKey, GmapUtil,Logger) ->
    class IWindowParentModel extends ModelKey
        @include GmapUtil
        # Animation is enabled by default
        DEFAULTS: {}

        constructor: (scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache) ->
            super(scope)
            self = @
            @$log = Logger
            @$timeout = $timeout
            @$compile = $compile
            @$http = $http
            @$templateCache = $templateCache
            if scope.options?
                @DEFAULTS = scope.options
    IWindowParentModel
]