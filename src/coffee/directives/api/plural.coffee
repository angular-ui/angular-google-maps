angular.module('uiGmapgoogle-maps.directives.api')
.service 'uiGmapPlural', [->
  _initControl = (scope, parent) ->
    return unless scope.control?

    scope.control.updateModels = (models) ->
      scope.models = models
      parent.createChildScopes(false)

    scope.control.newModels = (models) ->
      scope.models = models
      parent.rebuildAll(scope, true, true)

    scope.control.clean = ->
      parent.rebuildAll(scope, false, true)

    scope.control.getPlurals = ->
      parent.plurals

    scope.control.getManager = ->
      parent.gManager

    scope.control.hasManager = ->
      parent.gManager? == true

    scope.control.managerDraw = ->
      scope.control.getManager()?.draw() if scope.control.hasManager()

  extend: (obj, obj2) ->
    _.extend obj.scope or {}, obj2 or {},
      idKey: '=idkey' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
      doRebuildAll: '=dorebuildall' #root level directive attribute not a model level, should default to false
      models: '=models'
      chunk: '=chunk' #false to disable chunking, otherwise a number to define chunk size
      cleanchunk: '=cleanchunk' #false to disable chunking, otherwise a number to define chunk size
      control: '=control'

  link: (scope, parent) ->
    _initControl(scope, parent)



]
