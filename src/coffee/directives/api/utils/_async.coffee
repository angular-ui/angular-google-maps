angular.module('uiGmapgoogle-maps.directives.api.utils')
.service('uiGmap_sync', [ ->
    fakePromise: ->
      _cb = undefined
      then: (cb) ->
        _cb = cb
      resolve: () ->
        _cb.apply(undefined, arguments)
  ])
.service 'uiGmap_async', [ '$timeout', 'uiGmapPromise', 'uiGmapLogger', '$q','uiGmapDataStructures', 'uiGmapGmapUtil',
($timeout, uiGmapPromise, $log, $q, uiGmapDataStructures, uiGmapGmapUtil) ->
  promiseTypes = uiGmapPromise.promiseTypes
  isInProgress = uiGmapPromise.isInProgress
  promiseStatus = uiGmapPromise.promiseStatus
  ExposedPromise =  uiGmapPromise.ExposedPromise
  SniffedPromise = uiGmapPromise.SniffedPromise

  kickPromise = (sniffedPromise, cancelCb) ->
    #kick a promise off and log some info on it
    promise = sniffedPromise.promise()
    promise.promiseType = sniffedPromise.promiseType
    $log.debug "promiseType: #{promise.promiseType}, state: #{promiseStatus promise.$$state.status}" if promise.$$state
    promise.cancelCb = cancelCb
    promise

  doSkippPromise = (sniffedPromise,lastPromise) ->
    # note this skipp could be specific to polys (but it works for that)
    if sniffedPromise.promiseType == promiseTypes.create and
      lastPromise.promiseType != promiseTypes.delete and lastPromise.promiseType != promiseTypes.init
        $log.debug "lastPromise.promiseType #{lastPromise.promiseType}, newPromiseType: #{sniffedPromise.promiseType}, SKIPPED MUST COME AFTER DELETE ONLY"
        return true
    false

  maybeCancelPromises = (queue, sniffedPromise,lastPromise) ->
#    $log.warn "sniff: promiseType: #{sniffedPromise.promiseType}, lastPromiseType: #{lastPromise.promiseType}"
#    $log.warn "lastPromise.cancelCb #{lastPromise.cancelCb}"
    if sniffedPromise.promiseType == promiseTypes.delete and lastPromise.promiseType != promiseTypes.delete
      if lastPromise.cancelCb? and _.isFunction(lastPromise.cancelCb) and isInProgress(lastPromise)
        $log.debug "promiseType: #{sniffedPromise.promiseType}, CANCELING LAST PROMISE type: #{lastPromise.promiseType}"
        lastPromise.cancelCb('cancel safe')
        #see if we can cancel anything else
        first = queue.peek()
        if first? and isInProgress(first)# and first.promiseType != promiseTypes.delete
          if first.hasOwnProperty("cancelCb") and _.isFunction first.cancelCb
            $log.debug "promiseType: #{first.promiseType}, CANCELING FIRST PROMISE type: #{first.promiseType}"
            first.cancelCb('cancel safe')
          else
            $log.warn 'first promise was not cancelable'

  ###
  From a High Level:
    This is a SniffedPromiseQueueManager (looking to rename) where the queue is existingPiecesObj.existingPieces.
    This is a function and should not be considered a class.
    So it is run to manage the state (cancel, skip, link) as needed.
  Purpose:
  The whole point is to check if there is existing async work going on. If so we wait on it.

  arguments:
  - existingPiecesObj =  Queue<Promises>
  - sniffedPromise = object wrapper holding a function to a pending (function) promise (promise: fnPromise)
  with its intended type.
  - cancelCb = callback which accepts a string, this string is intended to be returned at the end of _async.each iterator

    Where the cancelCb passed msg is 'cancel safe' _async.each will drop out and fall through. Thus canceling the promise
    gracefully without messing up state.

  Synopsis:

   - Promises have been broken down to 4 states create, update,delete (3 main) and init. (Helps boil down problems in ordering)
    where (init) is special to indicate that it is one of the first or to allow a create promise to work beyond being after a delete

   - Every Promise that comes is is enqueue and linked to the last promise in the queue.

   - A promise can be skipped or canceled to save cycles.

  Saved Cycles:
    - Skipped - This will only happen if async work comes in out of order. Where a pending create promise (un-executed) comes in
      after a delete promise.
    - Canceled - Where an incoming promise (un-executed promise) is of type delete and the any lastPromise is not a delete type.


  NOTE:
  - You should not muck with existingPieces as its state is dependent on this functional loop.
  - PromiseQueueManager should not be thought of as a class that has a life expectancy (it has none). It's sole
  purpose is to link, skip, and kill promises. It also manages the promise queue existingPieces.
  ###
  PromiseQueueManager = (existingPiecesObj, sniffedPromise, cancelCb) ->
    unless existingPiecesObj.existingPieces
      #TODO: rename existingPieces to some kind of queue
      existingPiecesObj.existingPieces = new uiGmapDataStructures.Queue()
      existingPiecesObj.existingPieces.enqueue kickPromise(sniffedPromise, cancelCb)
    else
      lastPromise = _.last existingPiecesObj.existingPieces._content

      return if doSkippPromise(sniffedPromise, lastPromise)
      maybeCancelPromises(existingPiecesObj.existingPieces, sniffedPromise, lastPromise)

      newPromise = ExposedPromise lastPromise.finally ->
       kickPromise(sniffedPromise, cancelCb)
      newPromise.cancelCb = cancelCb
      newPromise.promiseType = sniffedPromise.promiseType
      existingPiecesObj.existingPieces.enqueue newPromise
      # finally is important as we don't care how something is canceled
      lastPromise.finally ->
        # keep the queue tight
        existingPiecesObj.existingPieces.dequeue()

  managePromiseQueue = (objectToLock, promiseType, msg = '', cancelCb, fnPromise) ->
    cancelLogger = (msg) ->
      $log.debug "#{msg}: #{msg}"
      cancelCb(msg)
    PromiseQueueManager objectToLock, SniffedPromise(fnPromise, promiseType), cancelLogger


  defaultChunkSize = 80
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

  each = (array, chunk, chunkSizeOrDontChunk = defaultChunkSize, pauseCb, index = 0, pauseMilli = 1) ->
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
  map = (objs, iterator, chunkSizeOrDontChunk, pauseCb, index, pauseMilli) ->

    results = []
    return uiGmapPromise.resolve(results)  unless objs? and objs?.length > 0

    each(objs, (o) ->
      results.push iterator o
    , chunkSizeOrDontChunk, pauseCb, index, pauseMilli)
    .then ->
      results


  each: each
  map: map
  managePromiseQueue: managePromiseQueue
  promiseLock: managePromiseQueue
  defaultChunkSize: defaultChunkSize
  chunkSizeFrom:(fromSize) ->
    ret = undefined
    if _.isNumber fromSize
      ret = fromSize
    if uiGmapGmapUtil.isFalse(fromSize) or fromSize == false
      ret = false
    ret
]
