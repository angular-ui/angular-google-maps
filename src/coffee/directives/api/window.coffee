angular.module("google-maps.directives.api".ns())
.factory "Window".ns(), [ "IWindow".ns(), "GmapUtil".ns(), "WindowChildModel".ns(), (IWindow, GmapUtil, WindowChildModel) ->
  class Window extends IWindow
    @include GmapUtil
    constructor:  ->
      super()
      @require = ['^' + 'GoogleMap'.ns(), '^?' + 'Marker'.ns()]
      @template = '<span class="angular-google-maps-window" ng-transclude></span>'
      @$log.info @
      @childWindows = []

    link: (scope, element, attrs, ctrls) =>

      #keep out of promise.then to keep scopes unique , not sure why yet
      mapScope = ctrls[0].getScope()
      markerCtrl = if ctrls.length > 1 and ctrls[1]? then ctrls[1] else undefined
      markerScope = markerCtrl?.getScope()
      #end of keep out of promise

      mapScope.deferred.promise.then (mapCtrl) =>
        isIconVisibleOnClick = true
        if angular.isDefined attrs.isiconvisibleonclick
          isIconVisibleOnClick = scope.isIconVisibleOnClick
        if not markerCtrl
          @init scope, element, isIconVisibleOnClick, mapCtrl
          return
        markerScope.deferred.promise.then  (gMarker) =>
          @init scope, element, isIconVisibleOnClick, mapCtrl, markerScope, gMarker

    init: (scope, element, isIconVisibleOnClick, mapCtrl, markerScope, gMarker) ->
      defaults = if scope.options? then scope.options else {}
      hasScopeCoords = scope? and @validateCoords(scope.coords)
      if markerScope?
        markerScope.$watch 'coords', (newValue, oldValue) =>
          if gMarker? and !childWindow.markerCtrl
            childWindow.markerCtrl = gMarker
            childWindow.handleClick true
          return childWindow.hideWindow() unless @validateCoords(newValue)
          if !angular.equals(newValue, oldValue)
            childWindow.getLatestPosition @getCoords newValue
        ,true


      opts = if hasScopeCoords then @createWindowOptions(gMarker, scope, element.html(), defaults) else defaults
      if mapCtrl? #at the very least we need a Map, the marker is optional as we can create Windows without markers
        childWindow = new WindowChildModel {}, scope, opts, isIconVisibleOnClick, mapCtrl, gMarker, element
        @childWindows.push childWindow

        scope.$on "$destroy", =>
          @childWindows = _.withoutObjects @childWindows,[childWindow], (child1,child2) ->
            child1.scope.$id == child2.scope.$id

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

      @onChildCreation childWindow if @onChildCreation? and childWindow?
]
