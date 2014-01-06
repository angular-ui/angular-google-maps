#SPEC set is to make sure Underscore is being understood and used correctly
describe "UnderScore Examples", ->
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
        describe "intersection", ->
            describe "same length", ->
                it "when two arrays are identical - same reference", ->
                    interArray = _.intersection(@objArray, @objArray)
                    expect(interArray.length).toEqual(@objArray.length)

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
                    interArray = _.intersection(@objArray, difArray)
                    expect(interArray.length).toEqual(0)

                it "diff reference, 1 val identical", ->
                    difArray = [
                        a: 1
                        b: 1
                    ]
                    interArray = _.intersection(@objArray, difArray)
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
                    index = @objArray.indexOf {a:1,b:1}
                    expect(index).toBe(-1)
                    interArray = _.intersection(@objArray, difArray)
                    expect(interArray.length).toEqual(0)

        describe "_.intersectionObjects - extension", ->
            describe "same length", ->
                it "when two arrays are identical - same reference", ->
                    interArray = _.intersectionObjects @objArray,@objArray
                    expect(interArray.length).toEqual(@objArray.length)
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
                    interArray = _.intersectionObjects @objArray,difArray
                    expect(interArray.length).toEqual(@objArray.length)

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
                        a:4
                        b:4
                    ]
                    diffArray = @objArray
                    interArray = _.intersectionObjects @objArray,difArray
                    expect(interArray.length).toEqual(@objArray.length)
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
                    interArray = _.intersectionObjects @objArray,difArray
                    expect(interArray.length).toEqual(0)

                it "diff reference, 1 val identical", ->
                    difArray = [
                        a: 1
                        b: 1
                    ]
                    interArray = _.intersectionObjects @objArray,difArray
                    expect(interArray.length).toEqual(1)
                    expect(interArray.length).toNotEqual(@objArray.length)
