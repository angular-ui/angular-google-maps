angular.module('uiGmapgoogle-maps')
.service 'uiGmapObjectIterators', ->
  _ignores = ['length', 'forEach', 'map']

  _iterators = []

  _slapForEach = (object) ->
    object.forEach = (cb) ->
      _.each _.omit(object, _ignores), (val) ->
        cb(val) unless _.isFunction val
    object

  _iterators.push _slapForEach


  _slapMap = (object) ->
    object.map = (cb) ->
      _.map _.omit(object, _ignores), (val) ->
        cb(val) unless _.isFunction val
    object

  _iterators.push _slapMap

  slapMap: _slapMap
  slapForEach: _slapForEach
  slapAll: (object) ->
    _iterators.forEach (it) ->
      it(object)
    object

