# wrapper to be 'like' bluebirds interface
angular.module('uiGmapgoogle-maps.directives.api.utils')
.service 'uiGmapPromise', [ '$q', ($q) -> 
  defer: ->
    $q.defer()
  resolve:  ->
    d = $q.defer()
    d.resolve.apply(undefined,arguments)
    d.promise
]