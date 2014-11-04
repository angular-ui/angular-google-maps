angular.module("uiGmapgoogle-maps.directives.api").service "uiGmapICircle", [ ->
  DEFAULTS = {}
  restrict: "EA"
  replace: true
  require: '^' + 'uiGmapGoogleMap'
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
