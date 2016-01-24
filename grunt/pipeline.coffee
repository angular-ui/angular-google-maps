pipeline = [
  "src/coffee/module"
  "src/coffee/providers/*"
  "src/coffee/extensions/*"
  "src/coffee/directives/api/utils/*"
  "src/coffee/directives/api/managers/*"

  "src/coffee/controllers/polyline-display"
  "src/coffee/utils/*"

  "src/coffee/directives/api/options/**/*"
  "src/coffee/directives/api/models/child/*"
  "src/coffee/directives/api/models/parent/*"
  "src/coffee/directives/api/*"
  "src/coffee/directives/map"
  "src/coffee/directives/marker"
  "src/coffee/directives/markers"
  "src/coffee/directives/label"
  "src/coffee/directives/polygon"
  "src/coffee/directives/circle"
  "src/coffee/directives/polyline*"
  "src/coffee/directives/rectangle"
  "src/coffee/directives/window"
  "src/coffee/directives/windows"
  "src/coffee/directives/layer"
  "src/coffee/directives/control"
  "src/coffee/directives/*"
]

module.exports =
  pipeline: pipeline
  fullPipeline: pipeline.map( (f) -> "tmp/#{f}.js").concat [
    "tmp/wrapped_uuid.js"
    "tmp/wrapped_gmaps_sdk_util_v3.js"
    "tmp/webpack.dataStructures.js"
    "tmp/wrapped_marker_spiderfier.js"
    "src/js/**/*.js" #this all will only work if the dependency orders do not matter
    "src/js/**/**/*.js"
    "src/js/**/**/**/*.js"
    "!src/js/wrapped/webpack/*.js"
    "!src/js/wrapped/*.js"
  ]
