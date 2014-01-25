describe "AsyncProcessor", ->
    beforeEach ->
        @subject = directives.api.utils.AsyncProcessor

    it "handle array of 101 outputs 101 elements equal to the original, with 1 pauses", ->
        known = _.range(101)
        test = []
        pauses = 1
        running =  true
        runs ->
            @subject.handleLargeArray(known,((num) -> test.push(num)),(()-> pauses++),(()-> running = false))

        waitsFor =>
            return !running
        ,'Failed to wait!',1000
        runs ->
            expect(running).toEqual(false)
            expect(pauses).toEqual(2)
            expect(test.length).toEqual(known.length)
            expect(test).toEqual(known)

    it "handle array of 200 outputs 200 elements equal to the original, with 2 pauses", ->
        known = _.range(200)
        test = []
        pauses = 1
        running =  true
        runs ->
            @subject.handleLargeArray(known,((num) -> test.push(num)),(()-> pauses++),(()-> running = false))
        waitsFor =>
            return !running
        ,'Failed to wait!',1000
        runs ->
            expect(running).toEqual(false)
            expect(pauses).toEqual(2)
            expect(test.length).toEqual(known.length)
            expect(test).toEqual(known)


    it "handle array of 1000 outputs 1000 elements equal to the original, with 10 pauses", ->
        known = _.range(1000)
        test = []
        pauses = 1
        running = true
        runs ->
            @subject.handleLargeArray(known,((num) -> test.push(num)),(()-> pauses++),(()-> running = false))
        waitsFor =>
            !running
        ,1000
        runs ->
            expect(running).toEqual(false)
            expect(pauses).toEqual(10)
            expect(test.length).toEqual(known.length)
            expect(test).toEqual(known)