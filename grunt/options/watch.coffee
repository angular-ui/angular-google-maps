module.exports =
  watch:
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
