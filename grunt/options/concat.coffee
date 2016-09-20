_ = require 'lodash'
{fullPipeline} = require '../pipeline'

# configs for concat main distribution & dev mapping
concatDist =
  options:
    banner: """
    /*! <%= pkg.name %> <%= pkgFn().version %> <%= grunt.template.today(\"yyyy-mm-dd\") %>
     *  <%= pkg.description %>
     *  <%= pkg.repository.type %>: <%= pkg.repository.url %>
     */
    ;
    (function( window, angular, _, undefined ){
      'use strict';
    """
    separator: ";"
    footer: "}( window, angular, _));"
  src: fullPipeline
  dest: "dist/<%= pkg.name %>.js"

concatDistMapped = _.cloneDeep concatDist
concatDistMapped.options.sourceMap = true
concatDistMapped.options.sourceMap = "dist/<%= pkg.name %>_dev_mapped.js.map"
concatDistMapped.dest = "dist/<%= pkg.name %>_dev_mapped.js"

# configs for concat street view directive & dev mapping
concatStreetView = _.cloneDeep concatDist
concatStreetView.src = [
  "src/coffee/module"
  "wrapped_uuid"
  "src/coffee/providers/map-loader"
  "src/coffee/directives/api/utils/logger"
  "src/coffee/directives/api/utils/gmap-util"
  "src/coffee/directives/api/utils/events-helper"
  "src/coffee/directives/street-view-panorama"
].map( (f) -> "tmp/#{f}.js" )
concatStreetView.dest = "dist/<%= pkg.name %>-street-view.js"
concatStreetViewMapped = _.cloneDeep concatStreetView
concatStreetViewMapped.options.sourceMap = true
concatStreetViewMapped.options.sourceMapName = "dist/<%= pkg.name %>-street-view_dev_mapped.js.map"
concatStreetViewMapped.dest = "dist/<%= pkg.name %>-street-view_dev_mapped.js"

module.exports =
  concat:
    dist: concatDist
    distMapped: concatDistMapped
    libs:
      # NOTE: need to figure out how to make these optional in the examples so they are not bundled
      src: [
        'node_modules/markerclustererplus/dist/markerclusterer.min.js'
        'node_modules/google-maps-utility-library-v3-infobox/dist/infobox.js'
        'node_modules/google-maps-utility-library-v3-keydragzoom/dist/keydragzoom.js'
        'node_modules/google-maps-utility-library-v3-markerwithlabel/dist/markerwithlabel.js'
        'bower_components/js-rich-marker/src/richmarker.js'
      ]
      dest: "tmp/gmaps_sdk_util_v3.js"
    streetview: concatStreetView
    streetviewMapped: concatStreetViewMapped
