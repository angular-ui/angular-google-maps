angular.module('uiGmapgoogle-maps.directives.api')
.factory 'uiGmapWindows', [
  'uiGmapIWindow', 'uiGmapPlural', 'uiGmapWindowsParentModel', 'uiGmapPromise', 'uiGmapLogger',
  (IWindow, Plural, WindowsParentModel, uiGmapPromise, $log) ->
    ###
    Windows directive where many windows map to the models property
    ###
    class Windows extends IWindow
      constructor: ->
        super()
        @require = ['^' + 'uiGmapGoogleMap', '^?' + 'uiGmapMarkers']
        @template = '<span class="angular-google-maps-windows" ng-transclude></span>'
        Plural.extend @

        $log.debug @


      link: (scope, element, attrs, ctrls) =>
        mapScope = ctrls[0].getScope()
        markerCtrl = if ctrls.length > 1 and ctrls[1]? then ctrls[1] else undefined
        markerScope = markerCtrl?.getScope()

        mapScope.deferred.promise.then (map) =>
          promise = markerScope?.deferred?.promise or uiGmapPromise.resolve()
          promise.then =>
            pieces = @parentModel?.existingPieces
            if pieces
              pieces.then =>
                @init scope, element, attrs, ctrls, map, markerScope
            else
              @init scope, element, attrs, ctrls, map, markerScope

      init: (scope, element, attrs, ctrls, map, additionalScope) =>
        parentModel = new WindowsParentModel(scope, element, attrs, ctrls, map, additionalScope)
        Plural.link(scope, parentModel)
        if scope.control?
          scope.control.getGWindows = =>
            parentModel.plurals.map (child)->
              child.gObject
          #deprecated use getPlurals
          scope.control.getChildWindows = =>
            parentModel.plurals


]
