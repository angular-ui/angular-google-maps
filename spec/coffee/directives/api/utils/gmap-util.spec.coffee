describe "utils.gmap-util", ->
  beforeEach ->
    module "google-maps.directives.api.utils"
    inject (GmapUtil) =>
      @subject = GmapUtil

  it "should validate the path correctly", ->
    latlong = {longitude: 45, latitude: -27}
    expect(@subject.validatePath([latlong, latlong])).toEqual(true)
    expect(@subject.validatePath([latlong])).toEqual(false)
    expect(@subject.validatePath([])).toEqual(false)
    expect(@subject.validatePath([{}, {}])).toEqual(false)
    expect(@subject.validatePath({type: "Polygon"})).toEqual(false)
    expect(@subject.validatePath({type: "Polygon", coordinates: [[1,2] for [1..4]]})).toEqual(true)
    expect(@subject.validatePath({type: "Polygon", coordinates: [[1,2] for [1..1]]})).toEqual(false)
    expect(@subject.validatePath({type: "LineString", coordinates: [1,2] for [1..2]})).toEqual(true)
    expect(@subject.validatePath({type: "LineString", coordinates: [1,2] for [1..1]})).toEqual(false)
    expect(@subject.validatePath({type: "foo", coordinates: []})).toEqual(false)
    expect(@subject.validatePath({type: "LineString", coordinates: [] for [1..2]})).toEqual(false)

  it "should validate coordinates correctly", ->
    expect(@subject.validateCoords()).toEqual(false)
    expect(@subject.validateCoords([1,2])).toEqual(true)
    expect(@subject.validateCoords([])).toEqual(false)

    expect(@subject.validateCoords({type: "Point", coordinates: [1,2]})).toEqual(true)
    expect(@subject.validateCoords({type: "Point", coordinates:[]})).toEqual(false)
    expect(@subject.validateCoords({type: "foo", coordinates:[]})).toEqual(false)

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
    expect(@subject.convertPathPoints({type:"Polygon", coordinates:[[1,2] for [1..4]]}).getLength()).toEqual(4)
    expect(@subject.convertPathPoints({type:"LineString", coordinates:[1,2] for [1..4]}).getLength()).toEqual(4)

  it "should increase coverage", ->
    latlong = {longitude: 45, latitude: -27}
    @subject.getCoords(latlong)
    @subject.getLabelPositionPoint("0 1")
    @subject.extendMapBounds({fitBounds: (bounds) -> return undefined}, [])


