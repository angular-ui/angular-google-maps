{pipeline} = require '../pipeline'

module.exports =
  coffee:
    compile:
      expand: true,
      flatten: false,
      src: pipeline.map (f) -> f + '.coffee'
      dest: 'tmp/'
      ext: '.js'
