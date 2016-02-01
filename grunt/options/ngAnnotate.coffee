{pipeline} = require '../pipeline'

module.exports =
  ngAnnotate:
    options:
      singleQuotes: true
    app:
      files: [
        expand: true
        src: pipeline.map (f) -> "tmp/#{f}.js"
      ]
