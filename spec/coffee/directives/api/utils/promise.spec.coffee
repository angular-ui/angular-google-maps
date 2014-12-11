describe 'uiGmapPromise', ->
  rootScope = null
  timeout = null
  q = null

  digest = (fn, times = 1) =>
    fn()
    if times
      _.range(times).forEach -> # i would like to say that it sucks that I have to do this.. (angular)
        timeout?.flush()
    rootScope?.$apply()

  beforeEach ->
    module 'uiGmapgoogle-maps'
    inject (_$rootScope_, $timeout, uiGmapPromise, $q) =>
      q = $q
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

  describe 'ExposedPromise', ->
    describe 'can be notified', ->
      it 'from wrapped', (done) ->
        d = q.defer()
        promise = d.promise

        digest =>
          cPromise = @subject.ExposedPromise promise

          cPromise.then (->), (->),
            (notifyMsg) ->
              done()
              expect(notifyMsg).toBe('test')
          cPromise.notify 'test'
        , false

      it 'from original', (done) ->
        d = q.defer()
        promise = d.promise

        digest =>
          cPromise = @subject.ExposedPromise promise

          cPromise.then (->), (->),
            (notifyMsg) ->
              done()
              expect(notifyMsg).toBe('test')
          d.notify 'test'
        , false


    it 'can be canceled', (done) ->
      d = q.defer()
      promise = d.promise
      cPromise = null

      digest =>
        cPromise = @subject.ExposedPromise promise

        cPromise.cancel 'blah'
        cPromise
        .catch (notifyMsg) ->
          expect(notifyMsg).toBe 'blah'
          done()

        #          d.notify('test')
      , false

    it 'original promise resolves combined', (done) ->
      d = q.defer()
      promise = d.promise
      cPromise = null
      digest =>
        cPromise = @subject.ExposedPromise promise

        d.resolve('winning')

        cPromise
        .then (msg) ->
          expect(msg).toBe 'winning'
          done()

      , false