###global angular:true, inject:true, expect: true ###
describe 'ModelKey Tests', ->
  beforeEach ->
    angular.mock.module('uiGmapgoogle-maps.directives.api.utils')
    inject [ '$rootScope', 'uiGmapModelKey', ($rootScope, ModelKey) =>
      @scope = $rootScope.$new()
      @subject = new ModelKey(@scope)
    ]

  it 'should eval model handle correctly', ->
    model = {key: 'key', sub: { foo: 'bar' }}
    expect(@subject.evalModelHandle()).toEqual(undefined)
    expect(@subject.evalModelHandle(model, 'self')).toEqual(model)
    expect(@subject.evalModelHandle(model, 'key')).toEqual('key')
    expect(@subject.evalModelHandle(model, 'foo')).toEqual(undefined)
    expect(@subject.evalModelHandle(model, 'sub.foo')).toEqual('bar')

  describe 'should properly compare models', ->
    beforeEach ->
      @model1 = {coords: {latitude: 41, longitude: -27}}
      @model2 = {coords: {latitude: 40, longitude: -27}}
      @model3 = {coords: { type: 'Point', coordinates: [ -27, 40 ] }}
      @model4 = {options: {animation: 2, visible: true}, coords: {latitude: 41, longitude: -27}}
      @model5 = {options: {animation: 2, visible: true}, coords: {latitude: 41, longitude: -27}}
      @model6 = {options: {animation: 2, visible: false}, coords: {latitude: 41, longitude: -27}}
      @subject.interface.scopeKeys = ['coords','options']
      delete @scope.coords
      delete @scope.options
      delete @scope.deepComparison

    it 'throws with no scope', ->
      expect(@subject.modelKeyComparison).toThrow('No scope set!')

    it 'model1 to model1 is same', ->
      @scope.coords = 'coords'
      expect(@subject.modelKeyComparison(@model1, @model1))
      .toEqual(true)

    it 'model1 to model2 is diff', ->
      @scope.coords = 'coords'
      expect(@subject.modelKeyComparison(@model1, @model2))
      .toEqual(false)

    it 'model2 to model3 is same by values', ->
      @scope.coords = 'coords'
      expect(@subject.modelKeyComparison(@model2, @model3))
      .toEqual(true)

    it 'model4 to model5 with options is same by values with deepComparison', ->
      @scope.coords = 'coords'
      @scope.options = 'options'
      @scope.deepComparison = true
      expect(@subject.modelKeyComparison(@model4, @model5))
      .toEqual(true)

    it 'model4 to model5 with options is diff without deepComparison', ->
      @scope.coords = 'coords'
      @scope.options = 'options'
      expect(@subject.modelKeyComparison(@model4, @model5))
      .toEqual(false)

    it 'model4 to model6 with different options is diff with deepComparison', ->
      @scope.coords = 'coords'
      @scope.options = 'options'
      @scope.deepComparison = true
      expect(@subject.modelKeyComparison(@model4, @model6))
      .toEqual(false)

    it 'model4 to model6 with different options is diff without deepComparison', ->
      @scope.coords = 'coords'
      @scope.options = 'options'
      expect(@subject.modelKeyComparison(@model4, @model6))
      .toEqual(false)

  it 'should properly set id key', ->
    expect(@subject.idKey).toEqual(undefined)
    expect(@subject.setIdKey(@scope)).toEqual('id')
    @scope.idKey = 'foo'
    expect(@subject.setIdKey(@scope)).toEqual('foo')
