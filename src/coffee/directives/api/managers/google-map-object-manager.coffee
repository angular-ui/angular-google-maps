angular.module('uiGmapgoogle-maps.directives.api.managers')
.service 'uiGmapGoogleMapObjectManager', [ () ->
  _availableInstances = []
  _usedInstances = []
  return {
    createMapInstance: (parentElement, options) ->
      instance = null
      if _availableInstances.length == 0
        instance = new google.maps.Map(parentElement, options)
        _usedInstances.push(instance)
      else
        instance = _availableInstances.pop()
        angular.element(parentElement).append(instance.getDiv())
        instance.setOptions(options)
        _usedInstances.push(instance)
      return instance
    recycleMapInstance: (instance) ->
      index = _usedInstances.indexOf(instance)
      if index < 0
        throw new Error('Expected map instance to be a previously used instance')
      _usedInstances.splice(index, 1)
      _availableInstances.push(instance)
  }
]