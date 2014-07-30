angular.module("google-maps.directives.api.utils")
.service 'CtrlHandle', ['$q', ($q) ->
  CtrlHandle =
    handle: ($scope, $element) ->
      $scope.deferred = $q.defer()
      getScope: ->
        $scope

    mapPromise: (scope, ctrl) ->
      mapScope = ctrl.getScope()
      mapScope.deferred.promise.then (map) ->
        scope.map = map
      mapScope.deferred.promise
]