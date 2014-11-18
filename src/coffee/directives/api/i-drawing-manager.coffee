angular.module('uiGmapgoogle-maps.directives.api').service 'uiGmapIDrawingManager', [ ->
  restrict: 'EA'
  replace: true
  require: '^' + 'uiGmapGoogleMap'
  scope:
    static: '@'
    control: '='
    options: '='
]
