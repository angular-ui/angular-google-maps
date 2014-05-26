describe "_async", ->
    beforeEach ->
        @subject = _async

    it "handle callback passes an index", (done) ->
        _async.each [1], (thing,index)->
          expect(thing).toEqual 1
          expect(index).toEqual 0
          done()

    it "handle array of 101 outputs 101 elements equal to the original, with 1 pauses", (done) ->
        known = _.range(101)
        test = []
        pauses = 1
        @subject.each(known,((num) -> test.push(num)),()->
            done()
            expect(pauses).toEqual(2)
            expect(test.length).toEqual(known.length)
            expect(test).toEqual(known)
        ,(()-> pauses++),100)

    it "handle array of 200 outputs 200 elements equal to the original, with 2 pauses", (done) ->
        known = _.range(200)
        test = []
        pauses = 1
        running =  true
        @subject.each(known,((num) -> test.push(num)),()->
            done()
            expect(pauses).toEqual(2)
            expect(test.length).toEqual(known.length)
            expect(test).toEqual(known)
        ,(()-> pauses++),100)

    it "handle array of 1000 outputs 1000 elements equal to the original, with 10 pauses", (done) ->
        known = _.range(1000)
        test = []
        pauses = 1
        @subject.each(known,((num) -> test.push(num)),()->
            done()
            expect(pauses).toEqual(10)
            expect(test.length).toEqual(known.length)
            expect(test).toEqual(known)
        ,(()-> pauses++),100)


    it "handle map of 1000 outputs 1000 elements equal to the original, with 10 pauses", (done) ->
        known = _.range(1000)
        test = []
        pauses = 1
        running = true
        @subject.map(known,((num) ->
            num += 1
            "$#{num.toString()}"),(mapped)->
            test = mapped
            done()
            expect(pauses).toEqual(10)
            expect(test[999]).toEqual("$1000")
            expect(test.length).toEqual(known.length)
            expect(test).toEqual(_.map(known,((n)-> n+=1; "$#{n.toString()}")))
        ,(()-> pauses++),100)
