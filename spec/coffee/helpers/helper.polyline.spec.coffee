describe 'Polyline Mock', ->
  subject = null
  beforeEach ->
    module "uiGmapgoogle-maps.mocks"
    inject (GoogleApiMock) ->
      apiMock = new GoogleApiMock()
      subject = apiMock.getPolyline()
      subject.resetInstances()

  it 'constructor exists', ->
    expect(subject).toBeDefined()

  it 'can create exists', ->
    poly = new subject()
    expect(poly).toBeDefined()
    expect(subject.instances).toBe(1)
