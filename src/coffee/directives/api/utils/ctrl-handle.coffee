angular.module("google-maps.directives.api.utils".ns())
.service "CtrlHandle".ns(), ['$q', ($q) ->
  CtrlHandle =
    handle: ($scope, $element) ->
      $scope.$on '$destroy', ->
        CtrlHandle.handle($scope)
      $scope.deferred = $q.defer()
      getScope: ->
        $scope

    mapPromise: (scope, ctrl) ->
      mapScope = ctrl.getScope()
      mapScope.deferred.promise.then (map) ->
        scope.map = map
      mapScope.deferred.promise
]
