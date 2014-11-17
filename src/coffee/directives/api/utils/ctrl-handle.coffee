angular.module('uiGmapgoogle-maps.directives.api.utils')
.service 'uiGmapCtrlHandle', ['$q', ($q) ->
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
