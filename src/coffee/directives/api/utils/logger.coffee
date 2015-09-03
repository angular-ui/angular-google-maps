angular.module('uiGmapgoogle-maps.directives.api.utils')
.service 'uiGmapLogger', [ 'nemSimpleLogger', (nemSimpleLogger) ->
  nemSimpleLogger.spawn()
]
