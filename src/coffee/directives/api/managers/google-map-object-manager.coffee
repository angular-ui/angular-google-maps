angular.module('uiGmapgoogle-maps.directives.api.managers')
.service 'uiGmapGoogleMapObjectManager', [ () ->
  _sharedInstance = null
  return {
    createMapInstance: (parentElement, options) ->
      if !_sharedInstance
        _sharedInstance = new google.maps.Map(parentElement, options)
      else
        angular.element(parentElement).append(_sharedInstance.getDiv())
        _sharedInstance.setOptions(options)
      return _sharedInstance
  }
]