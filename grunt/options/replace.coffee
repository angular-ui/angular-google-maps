module.exports =
  replace:
    utils:
      options:
        patterns: [
          match: 'REPLACE_W_LIBS', replacement: '<%= grunt.file.read("tmp/gmaps_sdk_util_v3.js") %>'
        ]
      src: 'src/js/wrapped/google-maps-util-v3.js'
      dest: 'tmp/wrapped_gmaps_sdk_util_v3.js'
    uuid:
      options:
        patterns: [
          match: 'REPLACE_W_LIBS',
          replacement: '<%= grunt.file.read("bower_components/uuid/dist/uuid.core.js") %>'
        ]
      src: 'src/js/wrapped/uuid.core.js'
      dest: 'tmp/wrapped_uuid.js'
    markerSpiderfier:
      options:
        patterns: [
          match: 'REPLACE_W_LIBS',
          replacement: '<%= grunt.file.read("bower_components/OverlappingMarkerSpiderfier/dist/oms.js") %>'
        ]
      src: 'src/js/wrapped/marker_spiderfier.js'
      dest: 'tmp/wrapped_marker_spiderfier.js'
