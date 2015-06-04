angular.module('uiGmapgoogle-maps.directives.api.utils')
.service 'uiGmapIsReady', ['$q', '$timeout', ($q, $timeout) ->
  _ctr = 0
  _proms = []
  _currentCheckNum = 1
  _maxCtrChecks = 50 #consider making this a angular const so it can be overriden by users

  _promises = ->
    $q.all _proms


  _checkIfReady = (deferred, expectedInstances) ->
    $timeout ->
      if _currentCheckNum >= _maxCtrChecks
        deferred.reject('Your maps are not found we have checked the maximum amount of times. :)')
      _currentCheckNum += 1
      if _ctr != expectedInstances
        _checkIfReady(deferred, expectedInstances)
      else
        deferred.resolve(_promises())
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

  promise: (expectedInstances = 1) ->
    d = $q.defer()
    _checkIfReady(d, expectedInstances)
    d.promise

  reset: ->
    _ctr = 0
    _proms.length = 0
    return

  decrement: ->
    _ctr -= 1
    _proms.length -= 1
    return
]
