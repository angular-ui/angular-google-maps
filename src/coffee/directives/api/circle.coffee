###global angular, _###
angular.module("uiGmapgoogle-maps.directives.api").factory "uiGmapCircle", [
  "uiGmapICircle", "uiGmapCircleParentModel",
  (ICircle,CircleParentModel) ->
    _.extend ICircle,
      link: (scope, element, attrs, mapCtrl) ->
        mapCtrl.getScope().deferred.promise.then (gMap) ->
          new CircleParentModel scope,element,attrs, gMap
  ]
