#SPEC set is to make sure Underscore is being understood and used correctly
describe "_.isEqual", ->
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
    describe "isEqual", ->
      describe "same length", ->
        it "when two arrays are identical - same reference", ->
          expect(_.isEqual(@objArray, @objArray)).toBeTruthy

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
          expect(_.isEqual(@objArray, difArray)).toBeTruthy

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
          expect(_.isEqual(@objArray, difArray)).toBeFalsy

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
          expect(_.isEqual(@objArray, difArray)).toBeFalsy

        it "diff reference, 1 val identical", ->
          difArray = [
            a: 1
            b: 1
          ]
          expect(_.isEqual(@objArray, difArray)).toBeFalsy
      describe "array of nested objects", ->
        beforeEach ->
          @objArray = [
            a: 1
            b:
              n: 1
              m: 2
              o: "hi!"
          ,
            a: 2
            b:
              n: 4
              m: 5
              o: "hi!"
          ,
            a:
              n: 2
              m: 3
              o: "hi!"
            b: 3
          ]
        it "same - reference should be equal", ->
          expect(_.isEqual(@objArray, @objArray)).toBeTruthy
        it "same - dif reference same values should be ==", ->
          difArray = [
            a: 1
            b:
              n: 1
              m: 2
              o: "hi!"
          ,
            a: 2
            b:
              n: 4
              m: 5
              o: "hi!"
          ,
            a:
              n: 2
              m: 3
              o: "hi!"
            b: 3
          ]
          expect(_.isEqual(@objArray, difArray)).toBeTruthy
        it "dif reference diff values should be !=", ->
          difArray = [
            a: 1
            b:
              n: 1
              m: 2
              o: "hi!"
          ,
            a: 2
            b:
              n: 4
              m: 5
              o: "hi!!"
          ,
            a:
              n: 2
              m: 3
              o: "hi!"
            b: 3
          ]
          expect(_.isEqual(@objArray, difArray)).toBeFalsy