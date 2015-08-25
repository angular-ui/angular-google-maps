angular.module('uiGmapgoogle-maps.directives.api.utils')
.service 'uiGmapIsReady', ['$q', '$timeout', ($q, $timeout) ->
  _ctr = 0
  _proms = []

  _promises = ->
    $q.all _proms


  _checkIfReady = (deferred, expectedInstances, retriesLeft) ->
    $timeout ->
      if retriesLeft <= 0
        deferred.reject('Your maps are not found we have checked the maximum amount of times. :)')
        return
      if _ctr != expectedInstances
        _checkIfReady(deferred, expectedInstances, retriesLeft-1)
      else
        deferred.resolve(_promises())
      return
    , 100

  spawn: ->
    d = $q.defer()
    _proms.push d.promise
    _ctr += 1

    instance: _ctr
    deferred: d

  promises: _promises

  instances: ->
    _ctr

  promise: (expectedInstances = 1, numRetries = 50) ->
    d = $q.defer()
    _checkIfReady(d, expectedInstances, numRetries)
    d.promise

  reset: ->
    _ctr = 0
    _proms.length = 0
    return

  decrement: ->
    _ctr -= 1 if _ctr > 0
    _proms.length -= 1 if _proms.length
    return
]
