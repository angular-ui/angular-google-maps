angular.module('uiGmapgoogle-maps.directives.api').service 'uiGmapIRectangle', [ ->
  'use strict'
  DEFAULTS = {}
  restrict: 'EMA'
  require: '^' + 'uiGmapGoogleMap'
  replace: true
  scope:
    bounds: '='
    stroke: '='
    clickable: '='
    draggable: '='
    editable: '='
    fill: '='
    visible: '='
    events: '='
]
