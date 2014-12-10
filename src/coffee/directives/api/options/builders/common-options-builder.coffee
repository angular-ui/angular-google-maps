angular.module('uiGmapgoogle-maps.directives.api.options.builders')
.service 'uiGmapCommonOptionsBuilder',
[ 'uiGmapBaseObject', 'uiGmapLogger', 'uiGmapModelKey', (BaseObject, $log, ModelKey) ->

  class CommonOptionsBuilder extends ModelKey
    constructor: ->
      @hasModel = _(@scope).chain().keys().contains('model').value()

    props: [
      'clickable'
      'draggable'
      'editable'
      'visible'
      {prop: 'stroke',isColl: true}
    ]

    buildOpts: (customOpts = {}, forEachOpts = {}) =>
      unless @scope
        $log.error 'this.scope not defined in CommonOptionsBuilder can not buildOpts'
        return
      unless @map
        $log.error 'this.map not defined in CommonOptionsBuilder can not buildOpts'
        return

      model = if @hasModel then @scope.model else @scope #handle plurals

      stroke = @scopeOrModelVal 'stroke', @scope, model
      opts = angular.extend customOpts, @DEFAULTS,
        map: @map
        strokeColor: stroke?.color
        strokeOpacity: stroke?.opacity
        strokeWeight: stroke?.weight

      angular.forEach angular.extend(forEachOpts,
          clickable: true
          draggable: false
          editable: false
          static: false
          fit: false
          visible: true
          zIndex: 0,
          icons: []
      ), (defaultValue, key) =>
        val = @scopeOrModelVal key, @scope, model
        if angular.isUndefined val
          opts[key] = defaultValue
        else
          opts[key] = model[key]

      opts.editable = false if opts.static
      opts

    watchProps: (props) =>
      unless props?
        props = @props
      props.forEach (prop) =>
        if @attrs[prop]? or @attrs[prop?.prop]?
          if prop?.isColl
            @scope.$watchCollection prop.prop, @setMyOptions
          else
            @scope.$watch prop, @setMyOptions

]
