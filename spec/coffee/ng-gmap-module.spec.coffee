
describe "ngGmapModule", ->
    it "exists ~ you loaded the script!", ->
        expect(ngGmapModule?).toEqual(true)
        #test module / namespace creation
@ngGmapModule "test", ->
    hidden = 10
    @open  = hidden
@ngGmapModule "testWithoutFn"

describe "ngGmapModule - creation tests", ->
    it "has no hidden", ->
        expect(test.hidden?).toEqual(false)

    it "has open", ->
        expect(test.open?).toEqual(true)
    it "ng-module created without function", ->
        expect(testWithoutFn?).toEqual(true)
