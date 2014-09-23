angular.module("google-maps.directives.api".ns())
.factory "Window".ns(), [ "IWindow".ns(), "GmapUtil".ns(), "WindowChildModel".ns(), (IWindow, GmapUtil, WindowChildModel) ->
  class Window extends IWindow
    @include GmapUtil
    constructor: ($timeout, $compile, $http, $templateCache) ->
      super($timeout, $compile, $http, $templateCache)
      @require = ['^' + 'GoogleMap'.ns(), '^?' + 'Marker'.ns()]
      @template = '<span class="angular-google-maps-window" ng-transclude></span>'
      @$log.info @
      @childWindows = []

    link: (scope, element, attrs, ctrls) =>
      mapScope = ctrls[0].getScope()
      mapScope.deferred.promise.then (mapCtrl) =>
        isIconVisibleOnClick = true
        if angular.isDefined attrs.isiconvisibleonclick
          isIconVisibleOnClick = scope.isIconVisibleOnClick
        markerCtrl = if ctrls.length > 1 and ctrls[1]? then ctrls[1] else undefined
        if not markerCtrl
          @init scope, element, isIconVisibleOnClick, mapCtrl
          return
        markerScope = markerCtrl.getScope()
        markerScope.deferred.promise.then =>
          @init scope, element, isIconVisibleOnClick, mapCtrl, markerScope

    init: (scope, element, isIconVisibleOnClick, mapCtrl, markerScope) =>
      defaults = if scope.options? then scope.options else {}
      hasScopeCoords = scope? and @validateCoords(scope.coords)
      if markerScope?
        gMarker = markerScope.gMarker
        markerScope.$watch 'coords', (newValue, oldValue) =>
          if markerScope.gMarker? and !window.markerCtrl
            window.markerCtrl = gMarker
            window.handleClick true
          return window.hideWindow() unless @validateCoords(newValue)
          if !angular.equals(newValue, oldValue)
            window.getLatestPosition @getCoords newValue
        ,true


      opts = if hasScopeCoords then @createWindowOptions(gMarker, scope, element.html(), defaults) else defaults
      if mapCtrl? #at the very least we need a Map, the marker is optional as we can create Windows without markers
        window = new WindowChildModel {}, scope, opts, isIconVisibleOnClick, mapCtrl, gMarker, element
        @childWindows.push window

        scope.$on "$destroy", =>
          @childWindows = _.withoutObjects @childWindows,[window], (child1,child2) ->
            child1.scope.$id == child2.scope.$id
      console.log 'scope.control', scope.control
      if scope.control?
        scope.control.getGWindows = =>
          @childWindows.map (child)=>
            child.gWin
        scope.control.getChildWindows = =>
          @childWindows
        scope.control.showWindow = =>
          @childWindows.map (child) =>
            child.showWindow()
        scope.control.hideWindow = =>
          @childWindows.map (child) =>
            child.hideWindow()

      @onChildCreation window if @onChildCreation? and window?
]
