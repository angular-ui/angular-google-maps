describe "_async", ->
  rootScope = null
  timeout = null

  digest = (fn, times = 1) =>
    fn()
    _.range(times).forEach -> # i would like to say that it sucks that I have to do this.. (angular)
      timeout?.flush()
    rootScope?.$apply()

  beforeEach ->
    module "uiGmapgoogle-maps"
    inject (_$rootScope_, $timeout, uiGmap_async) =>
      rootScope = _$rootScope_
      timeout = $timeout
      @subject = uiGmap_async

  afterEach ->
    rootScope = null
    @subject = null

  it "handle array of 101 outputs 101 elements equal to the original, with 1 pauses", (done) ->
    digest =>
      known = _.range(101)
      test = []
      pauses = 1

      @subject.each known, (num) ->
        test.push(num)
      , ->
        pauses++
      , 100
      .then ->
        expect(pauses).toEqual(2)
        expect(test.length).toEqual(known.length)
        expect(test).toEqual(known)
        done()

  it "handle callback passes an index", (done) ->
    digest =>
      chunkHit = false
      @subject.each [1], (thing, index)->
        chunkHit = true
        expect(thing).toEqual 1
        expect(index).toEqual 0
      .then ->
        expect(chunkHit).toBeTruthy()
        done()

  it "handle array of 200 outputs 200 elements equal to the original, with 2 pauses", (done) ->
    digest =>
      known = _.range(200)
      test = []
      pauses = 1

      @subject.each known, (num) ->
        test.push(num)
      , ->
        pauses++
      , 100
      .then ->
        expect(pauses).toEqual(2)
        expect(test.length).toEqual(known.length)
        expect(test).toEqual(known)
        done()

  it "handle array of 1000 outputs 1000 elements equal to the original, with 10 pauses", (done) ->
    digest =>
      known = _.range(1000)
      test = []
      pauses = 1
      @subject.each known, (num) ->
        test.push(num)
      , ->
        pauses++
      , 100
      .then ->
        expect(test.length).toEqual(known.length)
        expect(test).toEqual(known)
        expect(pauses).toEqual(10)
        done()
    , 10

  it "handle map of 1000 outputs 1000 elements equal to the original, with 10 pauses", (done) ->
    digest =>
      known = _.range(1000)
      test = []
      pauses = 1
      ret = @subject.map(known, (num) ->
        num += 1
        "$#{num.toString()}"
      , ->
        pauses++
      , 100)
      ret
      .then (mapped) ->
        test = mapped
        expect(test[999]).toEqual("$1000")
        expect(test.length).toEqual(known.length)
        expect(test).toEqual(
          _.map known, (n)->
            n += 1
            "$#{n.toString()}"
        )
        expect(pauses).toEqual(10)
        done()
    , 10

  describe "no chunking / pauses", ->
    it "rang 101 zero pauses", (done) ->
      digest =>
        known = _.range(101)
        test = []
        pauses = 0
        @subject.each known, (num) ->
          test.push(num)
        , ->
          pauses++
        , chunking = false
        .then ->
          expect(pauses).toEqual(0) #it should not be hit
          expect(test.length).toEqual(known.length)
          expect(test).toEqual(known)
          done()
