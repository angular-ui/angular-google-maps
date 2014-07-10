describe "PropMap tests", ->
  beforeEach ->
    angular.mock.module('google-maps.directives.api.models.parent')
    inject (PropMap) =>
      @PropMap = PropMap

  it "should construct", ->
    propMap = new @PropMap()
    expect(propMap?).toEqual(true)

  describe "PropMap method tests", ->
    beforeEach ->
      @propMap = new @PropMap()

    it "should have initial length 0", ->
      expect(@propMap.length).toEqual(0)

    it "should return undefined initially", ->
      expect(@propMap.get('foo')).toEqual(undefined)

    it "should return what is put", ->
      @propMap.put('foo', 'bar')
      expect(@propMap.get('foo')).toEqual('bar')

    it "should remove and reflect length", ->
      @propMap.put('foo', 'bar')
      expect(@propMap.length).toEqual(1)
      @propMap.remove('foo')
      expect(@propMap.get('foo')).toEqual(undefined)
      expect(@propMap.length).toEqual(0)

    it "should return all put values", ->
      @propMap.put('foo', 'bar')
      @propMap.put('baz', 'biz')
      values = @propMap.values()
      expected = ['bar', 'biz']
      expect(values[i]).toEqual(item) for item, i in expected

    it "should return all put keys", ->
      @propMap.put('foo', 'bar')
      @propMap.put('baz', 'biz')
      keys = @propMap.keys()
      expected = ['foo', 'baz']
      expect(keys[i]).toEqual(item) for item, i in expected
