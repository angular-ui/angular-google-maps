###
	- interface directive for all window(s) to derrive from
###
angular.module("google-maps.directives.api.models.parent".ns())
.factory "IWindowParentModel".ns(), ["ModelKey".ns(), "GmapUtil".ns(), "Logger".ns(), (ModelKey, GmapUtil, Logger) ->
  class IWindowParentModel extends ModelKey
    @include GmapUtil

    constructor: (scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache) ->
      super(scope)
      @$log = Logger
      @$timeout = $timeout
      @$compile = $compile
      @$http = $http
      @$templateCache = $templateCache
      @DEFAULTS = {}
      if scope.options?
        @DEFAULTS = scope.options
  IWindowParentModel
]