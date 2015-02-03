describe 'Events Mock', ->
  subject = null
  afterEach ->
    google.maps.event.clearListeners()
  beforeEach ->
    window['uiGmapInitiator'].initMock @, (apiMock) ->
      subject = apiMock.getPolyline()
      subject.resetInstances()

    @injectAll()

  it 'exists', ->
    expect(window.google.maps.event).toBeDefined()

  describe 'flatten', ->
    it 'can add a few events and they all are flattened', ->
      obj = {}
      expectedEvents = [
        'click'
        'mouseover'
        'mousedown'
      ]
      expectedEvents.forEach (e) ->
        google.maps.event.addListener obj, e, ->

      actualEvents = window.google.maps.event.normalizedEvents()

      expectedEvents.forEach (e) ->
        expect(actualEvents).toContain e

    it 'two individul object listeners', ->
      obj = {}
      obj2 = {}
      expectedEvents = [
        'click'
        'mouseover'
        'mousedown'
      ]
      expectedEvents2 = [
        'lol'
        'crap'
        'ROFL'
      ]
      expectedEvents.forEach (e) ->
        google.maps.event.addListener obj, e, ->

      expectedEvents2.forEach (e) ->
        google.maps.event.addListener obj2, e, ->

      actualEvents = window.google.maps.event.normalizedEvents()

      expectedEvents
      .concat(expectedEvents2).forEach (e) ->
        expect(actualEvents).toContain e
