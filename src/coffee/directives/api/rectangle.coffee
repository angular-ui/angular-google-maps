angular.module("google-maps.directives.api".ns()).factory "Rectangle".ns(),
["Logger".ns(), "GmapUtil".ns()
"IRectangle".ns(), "RectangleParentModel".ns(),
 ($log, GmapUtil,
  IRectangle, RectangleParentModel) ->
  _.extend IRectangle,
    link: (scope, element, attrs, mapCtrl) ->
      mapCtrl.getScope().deferred.promise.then (map) =>
        new RectangleParentModel scope,element,attrs,map
]
