#global jasmine protects
beforeEach ->
  @googleTemp = window.google
  @digest = (fn, times = 1) =>
    fn() if fn? and _.isFunction fn
    if times
      _.range(times).forEach => # i would like to say that it sucks that I have to do this.. (angular)
        # while !@timeout?.verifyNoPendingTasks()
        @timeout?.flush() if @browser.deferredFns?.length
    @rootScope?.$digest()

afterEach ->
  if @googleTemp?
    window.google = @googleTemp
