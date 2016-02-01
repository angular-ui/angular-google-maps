module.exports =
  jshint:
    all: [
      "Gruntfile.js"
      "temp/spec/js/*.js"
      "temp/spec/js/**/*.js"
      "temp/spec/js/**/**/*.js",
      "src/js/**/*.js"
      "src/js/**/**/*.js"
      "src/js/**/**/**/*.js"
      "!src/js/wrapped/*.js"
    ]
