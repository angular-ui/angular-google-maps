angular.module("google-maps.directives.api".ns()).factory "Circle".ns(), [
  "ICircle".ns(), "CircleParentModel".ns(),
  (ICircle,CircleParentModel) ->
    _.extend ICircle,
      link: (scope, element, attrs, mapCtrl) ->
        mapCtrl.getScope().deferred.promise.then (map) =>
          new CircleParentModel scope,element,attrs, map
  ]
