describe 'uiGmapPromise', ->
  rootScope = null
  timeout = null

  digest = (fn, times = 1) =>
    fn()
    _.range(times).forEach -> # i would like to say that it sucks that I have to do this.. (angular)
      timeout.flush()
    rootScope.$apply()

  beforeEach ->
    module 'uiGmapgoogle-maps'
    inject (_$rootScope_, $timeout, uiGmapPromise) =>
      rootScope = _$rootScope_
      timeout = $timeout
      @subject = uiGmapPromise

  afterEach ->
    rootScope = null
    @subject = null

  it 'exists', ->
    expect(@subject).toBeDefined()    
        
  it 'resolves immediately', (done) ->
    digest =>
      @subject.resolve().then ->
        done()