angular.module("google-maps.directives.api".ns()).service "IRectangle".ns(), [ ->
  "use strict"
  DEFAULTS = {}
  restrict: "EMA"
  require: '^' + 'GoogleMap'.ns()
  replace: true
  scope:
    bounds: "="
    stroke: "="
    clickable: "="
    draggable: "="
    editable: "="
    fill: "="
    visible: "="
    events: "="
]
