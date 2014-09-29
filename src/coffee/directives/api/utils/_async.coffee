angular.module("google-maps.directives.api.utils".ns())
.service("_sync".ns(), [ ->
  fakePromise: ->
    _cb = undefined
    then: (cb) ->
      _cb = cb
    resolve:() ->
      _cb.apply(undefined,arguments)
])
.factory "_async".ns(), [ ->

  defaultChunkSize = 20

  ###
  utility to reduce code bloat. The whole point is to check if there is existing synchronous work going on.
  If so we wait on it.

  Note: This is fully intended to be mutable (ie existingPiecesObj is getting existingPieces prop slapped on)
  ###
  waitOrGo = (existingPiecesObj,fnPromise) ->
    unless existingPiecesObj.existingPieces
      existingPiecesObj.existingPieces = fnPromise()
    else
      existingPiecesObj.existingPieces = existingPiecesObj.existingPieces.then ->
        fnPromise()

  ###
    Author: Nicholas McCready & jfriend00
    _async handles things asynchronous-like :), to allow the UI to be free'd to do other things
    Code taken from http://stackoverflow.com/questions/10344498/best-way-to-iterate-over-an-array-without-blocking-the-ui

    The design of any functionality of _async is to be like lodash/underscore and replicate it but call things
    asynchronously underneath. Each should be sufficient for most things to be derived from.

    Optional Asynchronous Chunking via promises.
###
  doChunk = (array, chunkSizeOrDontChunk, pauseMilli, chunkCb, pauseCb, overallD, index) ->
    try
      if chunkSizeOrDontChunk and chunkSizeOrDontChunk < array.length
        cnt = chunkSizeOrDontChunk
      else
        cnt = array.length

      i = index

      while cnt-- and i < (if array then array.length else i + 1)
        # process array[index] here
        chunkCb(array[i], i)
        ++i

      if array
        if i < array.length
          index = i
          if chunkSizeOrDontChunk
            pauseCb?()
            setTimeout(->
              doChunk array, chunkSizeOrDontChunk, pauseMilli, chunkCb, pauseCb, overallD, index
            , pauseMilli)
        else
          overallD.resolve()
    catch e
      overallD.reject("error within chunking iterator: #{e}")

  each = (array, chunk, pauseCb, chunkSizeOrDontChunk = defaultChunkSize, index = 0, pauseMilli = 1) ->
    ret = undefined
#    overallD = $q.defer()
    overallD = Promise.defer()
    ret = overallD.promise

    unless pauseMilli
      overallD.reject "pause (delay) must be set from _async!"
      return ret

    if array == undefined or array?.length <= 0
      overallD.resolve()
      return ret
    # set this to whatever number of items you can process at once
    doChunk(array, chunkSizeOrDontChunk, pauseMilli, chunk, pauseCb, overallD, index)

    return ret

  #copied from underscore but w/ async each above
  map = (objs, iterator, pauseCb, chunkSizeOrDontChunk, index, pauseMilli) ->

    results = []
    return Promise.resolve(results)  unless objs? and objs?.length > 0

    each(objs, (o) ->
      results.push iterator o
    , pauseCb, chunkSizeOrDontChunk, index, pauseMilli)
    .then ->
      results

  each: each
  map: map
  waitOrGo: waitOrGo
  defaultChunkSize: defaultChunkSize

]
