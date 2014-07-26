angular.module("google-maps.directives.api.utils")
.service 'CtrlHandle', ['$q', ($q) ->
  CtrlHandle =
    handle: ($scope, $element) ->
      $scope.deferred = $q.defer()
      getScope: ->
        $scope
]