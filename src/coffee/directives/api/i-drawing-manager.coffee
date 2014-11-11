angular.module("google-maps.directives.api".ns()).service "IDrawingManager".ns(), [ ->
  restrict: "EA"
  replace: true
  require: '^' + 'GoogleMap'.ns()
  scope:
    static: "@"
    control: "="
    options: "="
]
