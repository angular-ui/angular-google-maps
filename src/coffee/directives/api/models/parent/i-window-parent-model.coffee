angular.module("uiGmapgoogle-maps.directives.api.models.parent")
.factory "uiGmapIWindowParentModel", ["uiGmapModelKey", "uiGmapGmapUtil", "uiGmapLogger", (ModelKey, GmapUtil, Logger) ->
  class IWindowParentModel extends ModelKey
    @include GmapUtil

    constructor: (scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache) ->
      super scope
      @$log = Logger
      @$timeout = $timeout
      @$compile = $compile
      @$http = $http
      @$templateCache = $templateCache
      @DEFAULTS = {}
      if scope.options?
        @DEFAULTS = scope.options

    getItem: (scope, modelsPropToIterate, index) ->
      if modelsPropToIterate == 'models'
        return scope[modelsPropToIterate][index]
      scope[modelsPropToIterate].get index #otherwise it is a propMap
]
