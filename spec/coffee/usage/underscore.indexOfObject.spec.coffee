describe "_.indexOfObject", ->
    beforeEach ->
        @objArray = [
            a: 1
            b: 1
        ,
            a: 2
            b: 2
        ,
            a:5
            b:3
        ,
            a: 3
            b: 3
        ]
    it "finds first element", ->
        i = _.indexOfObject(@objArray, {a:1,b:1})
        expect(i).toEqual(0)

    it "finds element beginning", ->
        i = _.indexOfObject(@objArray, {a:2,b:2})
        expect(i).toEqual(1)
    it "finds last element", ->
        i = _.indexOfObject(@objArray, {a:5,b:3})
        expect(i).toEqual(2)

    it "finds last element", ->
        i = _.indexOfObject(@objArray, {a:3,b:3})
        expect(i).toEqual(3)

    it "find no element", ->
        i = _.indexOfObject(@objArray, {a:4,b:3})
        expect(i).toEqual(-1)
