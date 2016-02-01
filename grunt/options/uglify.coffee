_ = require 'lodash'
# configs for uglify main distribution & dev mapping
uglifyDist=
  options:
    banner: "/*! <%= pkg.name %> <%= pkgFn().version %> <%= grunt.template.today(\"yyyy-mm-dd\") %>\n *  <%= pkg.description %>\n *  <%= pkg.repository.type %>: <%= pkg.repository.url %>\n */\n"
    compress: true
    report: "gzip"
  src: "dist/<%= pkg.name %>.js"
  dest: "dist/<%= pkg.name %>.min.js"

uglifyDistMapped = _.clone uglifyDist, true
uglifyDistMapped.options.sourceMap = true
uglifyDistMapped.options.sourceMap = "dist/<%= pkg.name %>_dev_mapped.min.js.map"
uglifyDistMapped.src =  "dist/<%= pkg.name %>_dev_mapped.js"
uglifyDistMapped.dest = "dist/<%= pkg.name %>_dev_mapped.min.js"

# configs for uglify street view directive & dev mapping
uglifyStreetView = _.clone uglifyDist, true
uglifyStreetView.src = "dist/<%= pkg.name %>-street-view.js"
uglifyStreetView.dest = "dist/<%= pkg.name %>-street-view.min.js"
uglifyStreetViewMapped = _.clone uglifyStreetView, true
uglifyStreetViewMapped.options.sourceMap = true
uglifyStreetViewMapped.options.sourceMapName = "dist/<%= pkg.name %>-street-view_dev_mapped.min.js.map"
uglifyStreetViewMapped.src =  "dist/<%= pkg.name %>-street-view_dev_mapped.js"
uglifyStreetViewMapped.dest = "dist/<%= pkg.name %>-street-view_dev_mapped.min.js"

module.exports =
  uglify:
    dist: uglifyDist
    distMapped: uglifyDistMapped
    streetview: uglifyStreetView
    streetviewMapped: uglifyStreetViewMapped
