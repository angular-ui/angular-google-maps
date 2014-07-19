angular.module("google-maps.directives.api")
.factory "Windows", ["IWindow", "WindowsParentModel", (IWindow, WindowsParentModel) ->
  ###
  Windows directive where many windows map to the models property
  ###
  class Windows extends IWindow
    constructor: ($timeout, $compile, $http, $templateCache, $interpolate) ->
      super($timeout, $compile, $http, $templateCache)
      self = @
      @$interpolate = $interpolate
      @require = ['^googleMap', '^?markers']
      @template = '<span class="angular-google-maps-windows" ng-transclude></span>'
      @scope.idKey = '=idkey' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
      @scope.doRebuildAll = '=dorebuildall' #root level directive attribute not a model level
      @scope.models = '=models' #if undefined it will try get a markers models

      @$log.info @

    link: (scope, element, attrs, ctrls) =>
      parentModel = new WindowsParentModel(scope, element, attrs, ctrls, @$timeout,
          @$compile, @$http, @$templateCache, @$interpolate)

      if scope.control?
        scope.control.getGWindows = =>
          parentModel.windows.map (child)->
            child.gWin
        scope.control.getChildWindows = =>
          parentModel.windows
]