angular.module("google-maps.directives.api.options.builders".ns())
.service "CommonOptionsBuilder".ns(),
[ "BaseObject".ns(), "Logger".ns(), (BaseObject, $log) ->
  class CommonOptionsBuilder extends BaseObject
    props: [
      'clickable'
      'draggable'
      'editable'
      'visible'
      {prop: 'stroke',isColl: true}
    ]
    buildOpts: (customOpts = {}, forEachOpts = {}) =>
      unless @scope
        $log.error "this.scope not defined in CommonOptionsBuilder can not buildOpts"
        return
      unless @map
        $log.error "this.map not defined in CommonOptionsBuilder can not buildOpts"
        return
      opts = angular.extend customOpts, @DEFAULTS,
        map: @map
        strokeColor: @scope.stroke?.color
        strokeOpacity: @scope.stroke?.opacity
        strokeWeight: @scope.stroke?.weight

      angular.forEach angular.extend(forEachOpts,
          clickable: true
          draggable: false
          editable: false
          static: false
          fit: false
          visible: true
          zIndex: 0
      ), (defaultValue, key) =>
        if angular.isUndefined(@scope[key]) or @scope[key] is null
          opts[key] = defaultValue
        else
          opts[key] = @scope[key]

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
