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
