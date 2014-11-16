angular.module('uiGmapgoogle-maps.directives.api.options')
.service 'uiGmapMarkerOptions',
[ 'uiGmapLogger', 'uiGmapGmapUtil', ($log, GmapUtil) ->
  _.extend GmapUtil,
    createOptions: (coords, icon, defaults, map) ->
      defaults ?= {}

      opts = angular.extend {}, defaults,
        position: if defaults.position? then defaults.position else GmapUtil.getCoords coords
        visible: if defaults.visible? then defaults.visible else GmapUtil.validateCoords coords

      if defaults.icon? or icon?
        opts = angular.extend opts,
          icon: if defaults.icon? then defaults.icon else icon

      opts.map = map if map?
      opts

    isLabel: (options) ->
      if options.labelContent? or
          options.labelAnchor? or
          options.labelClass? or
          options.labelStyle? or
          options.labelVisible?
        return true
      else false

]
