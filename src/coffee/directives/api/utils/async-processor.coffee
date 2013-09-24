
###
    Author: Nicholas McCready & jfriend00
    AsyncProcessor handles things asynchronous-like :), to allow the UI to be free'd to do other things
    Code taken from http://stackoverflow.com/questions/10344498/best-way-to-iterate-over-an-array-without-blocking-the-ui
###
@ngGmapModule "directives.api.utils", ->
    @AsyncProcessor =
        handleLargeArray:(array, callback, pausedCallBack, doneCallBack ,chunk = 100, index = 0) ->
            if array == undefined or array.length <= 0
                doneCallBack()
                return
            # set this to whatever number of items you can process at once
            doChunk = () ->
                cnt = chunk
                i = index

                while cnt-- and i < array.length
                    # process array[index] here
                    callback(array[i])
                    ++i
                if i < array.length
                    index = i
                    pausedCallBack() if pausedCallBack?
                    setTimeout(doChunk, 1)
                else
                    doneCallBack()
            doChunk()