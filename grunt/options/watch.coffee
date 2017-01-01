_ =  require 'lodash'

coffeelint = {}
for n in ['grunt', 'src', 'spec']
  coffeelint[n] =
    options: livereload: true
    files: [
      "#{n}/**/*.coffee"
    ]
    tasks: ["coffeelint:#{n}"]


coffeelint.grunt.files.push '*.coffee'

coffeelintWatches = _.mapKeys coffeelint, (v, k) ->
  "coffeelint-#{k}"


module.exports = {
  coffeelint
  watch: _.extend coffeelintWatches,
    offline:
      options:
        livereload: true

      files: [
        "src/coffee/*.coffee", "src/coffee/**/*.coffee", "src/coffee/**/**/*.coffee",
        "src/js/*.js", "src/js/**/*.js", "src/js/**/**/*.js", "spec/**/*.spec.coffee",
        "spec/coffee/helpers/**"#,
        #"example/**"
      ]
      tasks: ['default-no-specs']
    all:
      options:
        livereload: true

      files: [
        "src/coffee/*.coffee", "src/coffee/**/*.coffee", "src/coffee/**/**/*.coffee",
        "src/js/*.js", "src/js/**/*.js", "src/js/**/**/*.js", "spec/**/*.spec.coffee",
        "spec/coffee/helpers/**", "spec/coffee/bootstrap.coffee"
        #"example/**"
      ]
      tasks: ["fast"]
    spec:
      options:
        livereload: true

      files: ["src/coffee/**/*.coffee"]
      tasks: ["karma"]
}

# console.log(module.exports)
