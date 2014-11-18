angular.module('uiGmapgoogle-maps.directives.api.utils')
.service 'uiGmapIsReady', ['$q', '$timeout', ($q, $timeout) ->
  ctr = 0
  proms = []

  promises = ->
    $q.all proms

  spawn: ->
    d = $q.defer()
    proms.push d.promise
    ctr += 1

    instance: ctr
    deferred: d

  promises: promises

  instances: ->
    ctr

  promise: (expect = 1) ->
    d = $q.defer()
    ohCrap = ->
      $timeout ->
        if ctr != expect
          ohCrap()
        else
          d.resolve(promises())
    ohCrap()
    d.promise

  reset: ->
    ctr = 0
    proms.length = 0
]
