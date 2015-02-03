describe 'uiGmapIMarkerParentModel', ->
  beforeEach ->
    angular.mock.module('uiGmapgoogle-maps.directives.api.models.parent')

    @clickCount = 0
    @html = '<ui-gmap-markers models="models"></ui-gmap-markers>'
    @injects.push ($http, $templateCache, $interpolate, uiGmapIMarkerParentModel) =>
        @attrs = {click: @click}
        @IMarkerParentModel = uiGmapIMarkerParentModel
        @scope.click = () =>
          @clickCount++

    @injectAll()

  it 'should instantiate', ->
    @scope.coords = {
      latitude: 47,
      longitude: -27
    }
    subject = new @IMarkerParentModel(@scope, @ele, @attrs, null, @$timeout)
    expect(subject?).toEqual(true)

  it 'should validate a scope correctly', ->
    try
      @subject = new @IMarkerParentModel(@scope, @ele, @attrs, null, @$timeout)
      expect(false).toEqual(true)
    catch e
      expect(e).toEqual('Unable to construct IMarkerParentModel due to invalid scope')

    @scope.coords = {
      latitude: 47,
      longitude: -27
    }
    @subject = new @IMarkerParentModel(@scope, @ele, @attrs, null, @$timeout)
    expect(@subject.validateScope(@scope)).toEqual(true)

  it 'should call watch on timeout for correct properties', ->
    props = []
    expectedProps = 'coords icon options'.split(' ')
    @IMarkerParentModel.prototype.watch = (prop, scope) =>
      props.push(prop)

    @scope.coords = {
      latitude: 47,
      longitude: -27
    }

    @subject = new @IMarkerParentModel(@scope, @ele, @attrs, null, @$timeout)
    expect(props[i]).toEqual(prop) for prop, i in expectedProps

  describe 'IMarkerParentModel method tests', ->
    beforeEach ->
      @scope.coords = {
        latitude: 47,
        longitude: -27
      }
      @subject = new @IMarkerParentModel(@scope, @ele, @attrs, null, @$timeout)

    it 'should throw onWatch', ->
      expect(@subject.onWatch).not.toThrow()

    it 'should throw onDestroy', ->
      expect(@subject.onDestroy).toThrow()
