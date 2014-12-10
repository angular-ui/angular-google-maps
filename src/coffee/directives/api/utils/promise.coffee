# wrapper to be 'like' bluebirds interface
angular.module('uiGmapgoogle-maps.directives.api.utils')
.service 'uiGmapPromise', [ '$q', '$timeout', ($q, $timeout) ->
  defer: ->
    $q.defer()
  resolve:  ->
    d = $q.defer()
    d.resolve.apply(undefined,arguments)
    d.promise

  promise: (fnToWrap) ->
    d = $q.defer()
    $timeout ->
      result = fnToWrap
      d.resolve result
    d.promise
]