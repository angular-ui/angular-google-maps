angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapWindow', [ 'uiGmapIWindow', 'uiGmapGmapUtil', 'uiGmapWindowChildModel','uiGmapLodash', 'uiGmapLogger',
  (IWindow, GmapUtil, WindowChildModel, uiGmapLodash, $log) ->
    class Window extends IWindow
      @include GmapUtil
      constructor:  ->
        super()
        @require = ['^' + 'uiGmapGoogleMap', '^?' + 'uiGmapMarker']
        @template = '<span class="angular-google-maps-window" ng-transclude></span>'
        $log.debug @
        @childWindows = []

      link: (scope, element, attrs, ctrls) =>
        #keep out of promise.then to keep scopes unique , not sure why yet
        markerCtrl = if ctrls.length > 1 and ctrls[1]? then ctrls[1] else undefined
        markerScope = markerCtrl?.getScope()
        #end of keep out of promise
        @mapPromise = IWindow.mapPromise(scope, ctrls[0])
        #looks like angulars $q is FIFO and Bluebird is LIFO
        @mapPromise.then (mapCtrl) =>
          isIconVisibleOnClick = true

          if angular.isDefined attrs.isiconvisibleonclick
            isIconVisibleOnClick = scope.isIconVisibleOnClick
          if not markerCtrl
            @init scope, element, isIconVisibleOnClick, mapCtrl
            return
          markerScope.deferred.promise.then  (gMarker) =>
            @init scope, element, isIconVisibleOnClick, mapCtrl, markerScope

      # post: (scope, element, attrs, ctrls) =>

      init: (scope, element, isIconVisibleOnClick, mapCtrl, markerScope) ->
        defaults = if scope.options? then scope.options else {}
        hasScopeCoords = scope? and @validateCoords(scope.coords)
        gMarker = markerScope.getGMarker() if markerScope?['getGMarker']?
        opts = if hasScopeCoords then @createWindowOptions(gMarker, scope, element.html(), defaults) else defaults
        if mapCtrl? #at the very least we need a Map, the marker is optional as we can create Windows without markers
          childWindow = new WindowChildModel {}, scope, opts, isIconVisibleOnClick, mapCtrl, markerScope, element
          @childWindows.push childWindow

          scope.$on '$destroy', =>
            @childWindows = uiGmapLodash.withoutObjects @childWindows,[childWindow], (child1,child2) ->
              child1.scope.$id == child2.scope.$id
            @childWindows.length = 0

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
