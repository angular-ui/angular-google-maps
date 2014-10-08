angular.module("google-maps.directives.api".ns()).factory "DrawingManager".ns(), [
  "IDrawingManager".ns(), "DrawingManagerParentModel".ns(),
  (IDrawingManager,DrawingManagerParentModel) ->
    _.extend IDrawingManager,
      link: (scope, element, attrs, mapCtrl) ->
        mapCtrl.getScope().deferred.promise.then (map) =>
          new DrawingManagerParentModel scope,element,attrs, map
]
