angular.module("google-maps.directives.api".ns())
.factory "Windows".ns(), ["IWindow".ns(), "WindowsParentModel".ns(), (IWindow, WindowsParentModel) ->
  ###
  Windows directive where many windows map to the models property
  ###
  class Windows extends IWindow
    constructor: ->
      super()
      @require = ['^' + 'GoogleMap'.ns(), '^?' + 'Markers'.ns()]
      @template = '<span class="angular-google-maps-windows" ng-transclude></span>'
      @scope.idKey = '=idkey' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
      @scope.doRebuildAll = '=dorebuildall' #root level directive attribute not a model level
      @scope.models = '=models' #if undefined it will try get a markers models

      @$log.debug @


    link: (scope, element, attrs, ctrls) =>
      mapScope = ctrls[0].getScope()
      markerCtrl = if ctrls.length > 1 and ctrls[1]? then ctrls[1] else undefined
      markerScope = markerCtrl?.getScope()

      mapScope.deferred.promise.then (map) =>
        promise = markerScope?.deferred?.promise or Promise.resolve()
        promise.then =>
          pieces = @parentModel?.existingPieces
          if pieces
            pieces.then =>
              @init scope, element, attrs, ctrls, map, markerScope
          else
            @init scope, element, attrs, ctrls, map, markerScope

    init: (scope, element, attrs, ctrls, map, additionalScope) =>
      parentModel = new WindowsParentModel(scope, element, attrs, ctrls, map, additionalScope)
      if scope.control?
        scope.control.getGWindows = =>
          parentModel.windows.map (child)->
            child.gWin
        scope.control.getChildWindows = =>
          parentModel.windows


]
