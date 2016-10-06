webpack = require 'webpack'
module.exports =
  # for  commonjs libraries that need to be rolled in
  webpack:
    commonjsDeps:
      entry:
        dataStructures: "./src/js/wrapped/webpack/data-structures.js",
      output:
        #Make sure to use [name] or [id] in output.filename
        path: "tmp/"
        filename: "webpack.[name].js",

    acceptance:
      entry:
        acceptance: "./spec/js/acceptance/app.js",
      output:
        #Make sure to use [name] or [id] in output.filename
        path: "tmp/acceptance"
        filename: "webpack.[name].js",
      externals:
        _ : "lodash"
      plugins: [
        new webpack.ProvidePlugin
          _ : "lodash"
      ]
