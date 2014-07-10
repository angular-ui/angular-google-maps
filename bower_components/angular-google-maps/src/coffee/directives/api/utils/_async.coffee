###
    Author: Nicholas McCready & jfriend00
    _async handles things asynchronous-like :), to allow the UI to be free'd to do other things
    Code taken from http://stackoverflow.com/questions/10344498/best-way-to-iterate-over-an-array-without-blocking-the-ui

    The design of any funcitonality of _async is to be like lodash/underscore and replicate it but call things
    asynchronously underneath. Each should be sufficient for most things to be derrived from.

    TODO: Handle Object iteration like underscore and lodash as well.. not that important right now
###
async =
  each: (array, callback, doneCallBack, pausedCallBack, chunk = 20, index = 0, pause = 1) ->
    unless pause
      throw "pause (delay) must be set from _async!"
      return
    if array == undefined or array?.length <= 0
      doneCallBack()
      return
    # set this to whatever number of items you can process at once
    doChunk = () ->
      cnt = chunk
      i = index

      while cnt-- and i < (if array then array.length  else i + 1)
        # process array[index] here
        callback(array[i],i)
        ++i

      if array
        if i < array.length
          index = i
          pausedCallBack() if pausedCallBack?
          setTimeout(doChunk, pause)
        else
          doneCallBack() if doneCallBack
    doChunk()

#copied from underscore but w/ async each above
  map: (objs, iterator, doneCallBack, pausedCallBack, chunk) ->
    results = []
    return results  unless objs?
    _async.each objs, (o) ->
      results.push iterator o
    , () ->
      doneCallBack(results)
    , pausedCallBack, chunk

window._async = async

angular.module("google-maps.directives.api.utils")
.factory "async", ->
    window._async
