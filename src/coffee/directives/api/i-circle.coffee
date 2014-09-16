angular.module("google-maps.directives.api".ns()).service "ICircle".ns(), [ ->
  DEFAULTS = {}
  restrict: "EA"
  replace: true
  require: '^' + 'GoogleMap'.ns()
  scope:
    center: "=center"
    radius: "=radius"
    stroke: "=stroke"
    fill: "=fill"
    clickable: "="
    draggable: "="
    editable: "="
    geodesic: "="
    icons: "=icons"
    visible: "="
    events: "="
]
