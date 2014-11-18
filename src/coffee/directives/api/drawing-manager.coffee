angular.module("uiGmapgoogle-maps.directives.api").factory "uiGmapDrawingManager", [
  "uiGmapIDrawingManager", "uiGmapDrawingManagerParentModel",
  (IDrawingManager, DrawingManagerParentModel) ->
    _.extend IDrawingManager,
      link: (scope, element, attrs, mapCtrl) ->
        mapCtrl.getScope().deferred.promise.then (map) ->
          new DrawingManagerParentModel scope, element, attrs, map
]
