angular.module('uiGmapgoogle-maps.directives.api.utils')
.service('uiGmap_sync', [ ->
    fakePromise: ->
      _cb = undefined
      then: (cb) ->
        _cb = cb
      resolve: () ->
        _cb.apply(undefined, arguments)
  ])
.service 'uiGmap_async', [ '$timeout', 'uiGmapPromise', 'uiGmapLogger', '$q','uiGmapDataStructures',
($timeout, uiGmapPromise, $log, $q, uiGmapDataStructures) ->

  promiseTypes =
    create : 'create'
    update : 'update'
    delete : 'delete'

  promiseStatuses =
    IN_PROGRESS: 0
    RESOLVED: 1
    REJECTED: 2

  strPromiseStatuses = do ->
    obj = {}
    obj["#{promiseStatuses.IN_PROGRESS}"] = 'in-progress'
    obj["#{promiseStatuses.RESOLVED}"] = 'resolved'
    obj["#{promiseStatuses.REJECTED}"] = 'rejected'
    obj

  isInProgress = (promise) ->
    promise.$$state.status == promiseStatuses.IN_PROGRESS

  isResolved = (promise) ->
    promise.$$state.status == promiseStatuses.RESOLVED

  promiseStatus = (status) ->
    if strPromiseStatuses.hasOwnProperty(status)
      strPromiseStatuses[status]
    else
      'done w error'

  #putting a payload together in order to not have to flatten twice, and to not
  #have to flatten again later
  cancelable = (promise) ->
    cancelDeferred = $q.defer()
    combined = $q.all [promise, cancelDeferred.promise]
    wrapped = $q.defer()

    promise.then cancelDeferred.resolve, (->), (notify)  ->
      cancelDeferred.notify notify
      wrapped.notify notify

    #if we completion from combined then we pass on the correct msh from its index
    combined.then (successes) ->
      wrapped.resolve successes[0] or successes[1]
    , (error) ->
      wrapped.reject error
#    , (notifies) -> #this is not handled in angular yet.. it should be
#      wrapped.notify notifies[0] or notifies[1]

    wrapped.promise.cancel = (reason = 'canceled') ->
      cancelDeferred.reject reason

    wrapped.promise.notify = (msg = 'cancel safe') ->
      wrapped.notify msg
      #if originating promise is a cancelable type (we can send it a message as well)
      promise.notify msg if promise.hasOwnProperty('notify')
#      else #possible hack, I dont think you supposed to go through the api this way
#        promise.$$state.pending.forEach (p) ->
#          p[0].notify msg if p.length >= 1

    if promise.promiseType?
      wrapped.promise.promiseType = promise.promiseType
    wrapped.promise

  onlyTheLast = do ->
    promises = []
    (p) ->
      promise = cancelable p
      promises.push promise
      promise.then (value) ->
        if promise is _.last promises
          if promises.length >= 2
            promises.forEach (promise, i) ->
              if i < promises.length - 1
                promise.cancel()
          promises = []

  preExecPromise = (fnPromise, promiseType) ->
    promise: fnPromise
    promiseType: promiseType

  ###
  The whole point is to check if there is existing async work going on.
  If so we wait on it.

  arguments:
  - existingPiecesObj =  Queue<Promises>
  - preExecPromise = object wrapper holding a function to a pending (function) promise (promise: fnPromise)
  with its intended type.
  - cancelCb = callback which accepts a string, this string is intended to be returned at the end of _async.each iterator

    Where the cancelCb passed msg is 'cancel safe' _async.each will drop out and fall through. Thus canceling the promise
    gracefully without messing up state.

  Synopsis:

   - Promises have been broken down to 3 states create, update, and delete. (Helps boil down problems in ordering)

   - Every Promise that comes is is enqueue and linked to the last promise in the queue.

   - A promise can be skipped or canceled to save cycles.

  Saved Cycles:
    - Skipped - This will only happen if async work comes in out of order. Where a pending create promise (un-executed) comes in
      after a delete promise.
    - Canceled - Where an incoming promise (un-executed promise) is of type delete and the any lastPromise is not a delete type.


  NOTE: You should not much with existingPieces as its state is dependent in this functional loop.
  ###
  waitOrGo = (existingPiecesObj, preExecPromise, cancelCb) ->
    logPromise = ->
      promise = preExecPromise.promise()
      if promise.hasOwnProperty('promiseType')
        $log.debug "promiseType: #{promise.promiseType}, state: #{promiseStatus promise.$$state.status}"
# uncomment to see promises wrapping themselves up
#        promise.then =>
#          $log.debug "old promiseType: #{promise.promiseType}, state: #{promiseStatus promise.$$state.status}"
      promise.cancelCb = cancelCb
      promise

    unless existingPiecesObj.existingPieces
      existingPiecesObj.existingPieces = new uiGmapDataStructures.Queue()
      #expecting incoming promise to be cancelable
      existingPiecesObj.existingPieces.enqueue logPromise()
    else
      lastPromise = _.last existingPiecesObj.existingPieces._content
      # note this skipp could be specific to polys (but it works for that)
      if preExecPromise.promiseType == promiseTypes.create and lastPromise.promiseType != promiseTypes.delete
        $log.debug "promiseType: #{preExecPromise.promiseType}, SKIPPED MUST COME AFTER DELETE ONLY"
        return
      if preExecPromise.promiseType == promiseTypes.delete and lastPromise.promiseType != promiseTypes.delete
        if lastPromise.cancelCb? and _.isFunction(lastPromise.cancelCb) and isInProgress(lastPromise)
          $log.debug "promiseType: #{preExecPromise.promiseType}, CANCELING LAST PROMISE type: #{lastPromise.promiseType}"
          lastPromise.cancelCb('cancel safe')

      newPromise = cancelable lastPromise.finally ->
       logPromise()
      newPromise.cancelCb = cancelCb
      newPromise.promiseType = preExecPromise.promiseType
      existingPiecesObj.existingPieces.enqueue newPromise
      lastPromise.then ->
        existingPiecesObj.existingPieces.dequeue()
      #important to come after hooking to old Promise
#      if existingPiecesObj.existingPieces.peek().$$state.status != promiseStatuses.IN_PROGRESS
#        existingPiecesObj.existingPieces.dequeue()

  defaultChunkSize = 20

  errorObject =
    value: null

  #https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
  tryCatch = (fn, ctx, args) ->
    try
      return fn.apply(ctx, args)
    catch e
      errorObject.value = e
      return errorObject

  logTryCatch = (fn, ctx, deferred, args) ->
    result = tryCatch(fn, ctx, args)
    if result == errorObject
      msg = "error within chunking iterator: #{errorObject.value}"
      $log.error msg
      deferred.reject msg
    if result == 'cancel safe'
      # THIS IS MAD IMPORTANT AS THIS IS OUR FALLTHOUGH TO ALLOW
      # _async.each iterator to drop out at a safe point (IE the end of its iterator callback)
      return false
    true


  ###
    Author: Nicholas McCready & jfriend00
    _async handles things asynchronous-like :), to allow the UI to be free'd to do other things
    Code taken from http://stackoverflow.com/questions/10344498/best-way-to-iterate-over-an-array-without-blocking-the-ui

    The design of any functionality of _async is to be like lodash/underscore and replicate it but call things
    asynchronously underneath. Each should be sufficient for most things to be derived from.

    Optional Asynchronous Chunking via promises.
###
  doChunk = (array, chunkSizeOrDontChunk, pauseMilli, chunkCb, pauseCb, overallD, index) ->
    if chunkSizeOrDontChunk and chunkSizeOrDontChunk < array.length
      cnt = chunkSizeOrDontChunk
    else
      cnt = array.length

    i = index
    keepGoing = true
    while keepGoing and cnt-- and i < (if array then array.length else i + 1)
      # process array[index] here
      keepGoing = logTryCatch chunkCb, undefined, overallD, [array[i], i]
      ++i

    if array
      if keepGoing and i < array.length
        index = i
        if chunkSizeOrDontChunk
          if pauseCb? and _.isFunction pauseCb
            logTryCatch pauseCb, undefined, overallD, []
          $timeout ->
            doChunk array, chunkSizeOrDontChunk, pauseMilli, chunkCb, pauseCb, overallD, index
          , pauseMilli, false
      else
        overallD.resolve()

  each = (array, chunk, pauseCb, chunkSizeOrDontChunk = defaultChunkSize, index = 0, pauseMilli = 1) ->
    ret = undefined
    overallD = uiGmapPromise.defer()
    ret = overallD.promise

    unless pauseMilli
      error = 'pause (delay) must be set from _async!'
      $log.error error
      overallD.reject error
      return ret

    if array == undefined or array?.length <= 0
      overallD.resolve()
      return ret
    # set this to whatever number of items you can process at once
    doChunk array, chunkSizeOrDontChunk, pauseMilli, chunk, pauseCb, overallD, index

    return ret

  #copied from underscore but w/ async each above
  map = (objs, iterator, pauseCb, chunkSizeOrDontChunk, index, pauseMilli) ->

    results = []
    return uiGmapPromise.resolve(results)  unless objs? and objs?.length > 0

    each(objs, (o) ->
      results.push iterator o
    , pauseCb, chunkSizeOrDontChunk, index, pauseMilli)
    .then ->
      results


  each: each
  map: map
  waitOrGo: waitOrGo
  defaultChunkSize: defaultChunkSize
  promiseTypes: promiseTypes
  cancelablePromise: cancelable
  preExecPromise: preExecPromise
]
