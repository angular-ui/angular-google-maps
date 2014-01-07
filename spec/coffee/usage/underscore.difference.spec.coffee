#SPEC set is to make sure Underscore is being understood and used correctly
describe "_.differenceObjects", ->
    beforeEach ->
        @objArray = [
            a: 1
            b: 1
        ,
            a: 2
            b: 2
        ,
            a: 3
            b: 3
        ]
    describe "Comparing Arrays of Objects", ->
        describe "difference", ->
            describe "0 length", ->
                it "when two arrays are identical - same reference", ->
                    interArray = _.difference(@objArray, @objArray)
                    expect(interArray.length).toEqual(0)

            describe "different length - not identical", ->
                it "diff reference, diff values", ->
                    difArray = [
                        a: 1
                        b: 2
                    ,
                        a: 2
                        b: 3
                    ,
                        a: 3
                        b: 4
                    ]
                    interArray = _.difference(@objArray, difArray)
                    expect(interArray.length).toEqual(3)

                it "diff reference, 1 val identical", ->
                    difArray = [
                        a: 1
                        b: 1
                    ]
                    interArray = _.difference(@objArray, difArray)
                    expect(interArray.length).toEqual(3)

                it "diff reference, same values", ->
                    difArray = [
                        a: 1
                        b: 1
                    ,
                        a: 2
                        b: 2
                    ,
                        a: 3
                        b: 3
                    ]
                    diffArray = @objArray
                    index = @objArray.indexOf {a: 1, b: 1}
                    expect(index).toBe(-1)
                    interArray = _.difference(@objArray, difArray)
                    expect(interArray.length).toEqual(3)

        describe "_.differenceObjects - extension", ->
            describe "same length", ->
                it "when two arrays are identical - same reference", ->
                    interArray = _.differenceObjects @objArray, @objArray
                    expect(interArray.length).toEqual(0)

                it "diff reference, same values", ->
                    difArray = [
                        a: 1
                        b: 1
                    ,
                        a: 2
                        b: 2
                    ,
                        a: 3
                        b: 3
                    ]
                    diffArray = @objArray
                    interArray = _.differenceObjects difArray, @objArray
                    expect(interArray.length).toEqual(0)

                it "diff reference one added (new), same values (intersected)", ->
                    difArray = [
                        a: 1
                        b: 1
                    ,
                        a: 2
                        b: 2
                    ,
                        a: 3
                        b: 3
                    ,
                        a: 4
                        b: 4
                    ]
                    diffArray = @objArray
                    interArray = _.differenceObjects difArray, @objArray
                    expect(interArray.length).toEqual(1)
            describe "different length - not identical", ->
                it "diff reference, diff values", ->
                    difArray = [
                        a: 1
                        b: 2
                    ,
                        a: 2
                        b: 3
                    ,
                        a: 3
                        b: 4
                    ]
                    interArray = _.differenceObjects difArray, @objArray
                    expect(interArray.length).toEqual(3)

                it "diff reference, 1 val identical", ->
                    difArray = [
                        a: 1
                        b: 1
                    ]
                    interArray = _.differenceObjects difArray,@objArray
                    expect(interArray.length).toEqual(0)
            describe "removal", ->
                it "diff reference, 1 val identical", ->
                    difArray = [
                        a: 1
                        b: 1
                    ]
                    interArray = _.withoutObjects @objArray, difArray
                    expect(interArray.length).toEqual(2)