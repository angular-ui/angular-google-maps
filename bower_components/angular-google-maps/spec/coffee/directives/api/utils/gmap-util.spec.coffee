describe "utils.gmap-util", ->
  beforeEach ->
    module "google-maps.directives.api.utils"
    module "google-maps.mocks"
    inject (GmapUtil, GoogleApiMock) =>
      @subject = GmapUtil
      @gmap = new GoogleApiMock()
      @gmap.mockAPI()
      @gmap.mockMVCArray()
      @gmap.mockPoint()
      @gmap.mockLatLng()
      @gmap.mockLatLngBounds()

  describe "should validate the path correctly", ->
    it "latlong", ->
      latlong = {longitude: 45, latitude: -27}
      expect(@subject.validatePath([latlong, latlong])).toEqual(true)
      expect(@subject.validatePath([latlong])).toEqual(false)
    it "empty array", ->
      expect(@subject.validatePath([])).toEqual(false)
    it "array of invalid objects", ->
      expect(@subject.validatePath([
        {},
        {}
      ])).toEqual(false)
    it "Polygon", ->
      expect(@subject.validatePath({type: "Polygon"})).toEqual(false)
      expect(@subject.validatePath({type: "Polygon", coordinates: [[1, 2] for [1..4]]})).toEqual(true)
      expect(@subject.validatePath({type: "Polygon", coordinates: [[1, 2] for [1..1]]})).toEqual(false)
    it "Polygon", ->
      expect(@subject.validatePath({type: "LineString", coordinates: [1, 2] for [1..2]})).toEqual(true)
      expect(@subject.validatePath({type: "LineString", coordinates: [1, 2] for [1..1]})).toEqual(false)
      expect(@subject.validatePath({type: "LineString", coordinates: [] for [1..2]})).toEqual(false)
    it "foo", ->
      expect(@subject.validatePath({type: "foo", coordinates: []})).toEqual(false)

  describe "should validate coordinates correctly", ->
    it "basic", ->
      expect(@subject.validateCoords()).toEqual(false)
      expect(@subject.validateCoords([1, 2])).toEqual(true)
      expect(@subject.validateCoords([])).toEqual(false)

    it "type:Point", ->
      expect(@subject.validateCoords({type: "Point", coordinates: [1, 2]})).toEqual(true)
      expect(@subject.validateCoords({type: "Point", coordinates: []})).toEqual(false)
    it "type:foo, no lat lon", ->
      expect(@subject.validateCoords({type: "foo", coordinates: []})).toEqual(false)
    it "type:foo, w lat lon", ->
      expect(@subject.validateCoords( type: "foo", latitude: 45, longitude:150 )).toEqual true

  it "should evaluate truthiness correctly", ->
    expect(@subject.isTrue(true)).toEqual(true)
    expect(@subject.isTrue("true")).toEqual(true)
    expect(@subject.isTrue("1")).toEqual(true)
    expect(@subject.isTrue("y")).toEqual(true)

    expect(@subject.isTrue()).toEqual(false)
    expect(@subject.isTrue(null)).toEqual(false)

  it "should evaluate falsiness correctly", ->
    expect(@subject.isFalse('false')).toEqual(true)
    expect(@subject.isFalse('FALSE')).toEqual(true)
    expect(@subject.isFalse(0)).toEqual(true)
    expect(@subject.isFalse('n')).toEqual(true)
    expect(@subject.isFalse('N')).toEqual(true)
    expect(@subject.isFalse('no')).toEqual(true)
    expect(@subject.isFalse('NO')).toEqual(true)

    # XXX: Is this really true?
    expect(@subject.isFalse(false)).toEqual(false)

  it "should convert path points correctly", ->
    latlong = {longitude: 45, latitude: -27}
    expect(@subject.convertPathPoints([]).getLength()).toEqual(0)
    expect(@subject.convertPathPoints([latlong]).getLength()).toEqual(1)
    expect(@subject.convertPathPoints({type: "Polygon", coordinates: [[1, 2] for [1..4]]}).getLength()).toEqual(4)
    expect(@subject.convertPathPoints({type: "LineString", coordinates: [1, 2] for [1..4]}).getLength()).toEqual(4)

  it "should increase coverage", ->
    latlong = {longitude: 45, latitude: -27}
    @subject.getCoords(latlong)
    @subject.getLabelPositionPoint("0 1")
    @subject.extendMapBounds({fitBounds: (bounds) -> return undefined}, [])

  it "(getLabelPositionPoint) should convert decimal coordinates separated by a space into a map Point object", ->
    testCases = [
      { input: '22 0', expected: { x: 22, y: 0 } }
      { input: '1 2', expected: { x: 1, y: 2 } }
      { input: '1.0 2.3', expected: { x: 1.0, y: 2.3 } }
      { input: '-1 -2', expected: { x: -1, y: -2 } }
    ]
    testCases.forEach (testCase ) =>
      result = @subject.getLabelPositionPoint(testCase.input)
      expect(result.x).toEqual(testCase.expected.x)
      expect(result.y).toEqual(testCase.expected.y)

  it "(getLabelPositionPoint) should ignore coordinate strings not following the format", ->
    testCases = [
      ' 1 2 '
      'a b'
      '1,2'
    ]
    testCases.forEach (testCase)=>
      result = @subject.getLabelPositionPoint(testCase.input)
