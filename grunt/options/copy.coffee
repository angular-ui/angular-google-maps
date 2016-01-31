module.exports =
  copy:
    dist:
      files: [
      ]
  # libraries that are not versioned well, not really on bower, not on a cdn yet
    poorly_managed_dev__dep_bower_libs:
      files: [
        src: [
          "bower_components/bootstrap-without-jquery/bootstrap3/bootstrap-without-jquery.js"
        ]
        dest: "website_libs/dev_deps.js"
      ]
