###
	WindowsChildModel generator where there are many ChildModels to a parent.
###
angular.module('uiGmapgoogle-maps.directives.api.models.parent')
.factory 'uiGmapWindowsParentModel',
  ['uiGmapIWindowParentModel', 'uiGmapModelsWatcher',
    'uiGmapPropMap', 'uiGmapWindowChildModel',
    'uiGmapLinked', 'uiGmap_async', 'uiGmapLogger',
    '$timeout', '$compile', '$http', '$templateCache', '$interpolate','uiGmapPromise',
    (IWindowParentModel, ModelsWatcher, PropMap, WindowChildModel, Linked, _async, $log,
      $timeout, $compile, $http, $templateCache, $interpolate,uiGmapPromise) ->
        class WindowsParentModel extends IWindowParentModel
          @include ModelsWatcher
          constructor: (scope, element, attrs, ctrls, @gMap, @markersScope) ->
            super(scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache)
            self = @
            @windows = new PropMap()

            @scopePropNames = ['coords', 'template', 'templateUrl', 'templateParameter',
                               'isIconVisibleOnClick', 'closeClick', 'options', 'show']
            #setting up local references to propety keys IE: @coordsKey
            _.each @scopePropNames, (name) =>
              @[name + 'Key'] = undefined
            @linked = new Linked(scope, element, attrs, ctrls)
            @models = undefined
            @contentKeys = undefined #model keys to parse html angular content
            @isIconVisibleOnClick = undefined
            @firstTime = true
            @firstWatchModels = true
            @$log.info(self)
            @parentScope = undefined

            @go(scope)

          go: (scope) =>
            @watchOurScope(scope)
            @doRebuildAll = if @scope.doRebuildAll? then @scope.doRebuildAll else false
            scope.$watch 'doRebuildAll', (newValue, oldValue) =>
              if (newValue != oldValue)
                @doRebuildAll = newValue

            @createChildScopesWindows()

          watchModels: (scope) =>
            scope.$watch 'models', (newValue, oldValue) =>
              #check to make sure that the newValue Array is really a set of new objects
              if not _.isEqual(newValue, oldValue) or @firstWatchModels
                @firstWatchModels = false
                if @doRebuildAll or @doINeedToWipe(newValue)
                  @rebuildAll(scope, true, true)
                else
                  doScratch = @windows.length == 0
                  if @existingPieces?
                    @existingPieces.then => @createChildScopesWindows doScratch
                  else
                    @createChildScopesWindows doScratch
            , true

          doINeedToWipe: (newValue) =>
            newValueIsEmpty = if newValue? then newValue.length == 0 else true
            @windows.length > 0 and newValueIsEmpty

          rebuildAll: (scope, doCreate, doDelete) =>
              @onDestroy(doDelete).then =>
                @createChildScopesWindows() if doCreate

          onDestroy:(doDelete) =>
            @destroyPromise().then =>
              @cleanOnResolve _async.waitOrGo @, =>
                @windows.each (model) =>
                  model.destroy()
                uiGmapPromise.resolve()
              .then =>
                delete @windows if doDelete
                @windows = new PropMap()
                @isClearing = false

          watchDestroy: (scope)=>
            scope.$on '$destroy', =>
              @firstWatchModels = true
              @firstTime = true
              @rebuildAll(scope, false, true)

          watchOurScope: (scope) =>
            _.each @scopePropNames, (name) =>
              nameKey = name + 'Key'
              @[nameKey] = if typeof scope[name] == 'function' then scope[name]() else scope[name]

          createChildScopesWindows: (isCreatingFromScratch = true) =>
            ###
            being that we cannot tell the difference in Key String vs. a normal value string (TemplateUrl)
            we will assume that all scope values are string expressions either pointing to a key (propName) or using
            'self' to point the model as container/object of interest.

            This may force redundant information into the model, but this appears to be the most flexible approach.
            ###
            @isIconVisibleOnClick = true
            if angular.isDefined(@linked.attrs.isiconvisibleonclick)
              @isIconVisibleOnClick = @linked.scope.isIconVisibleOnClick

            modelsNotDefined = angular.isUndefined @linked.scope.models

            if modelsNotDefined and (@markersScope == undefined or (@markersScope?.markerModels == undefined or @markersScope?.models == undefined))
              @$log.error('No models to create windows from! Need direct models or models derrived from markers!')
              return
            if @gMap?
              #at the very least we need a Map, the marker is optional as we can create Windows without markers
              if @linked.scope.models?
                #we are creating windows with no markers
                @watchIdKey @linked.scope
                if isCreatingFromScratch
                  @createAllNewWindows @linked.scope, false
                else
                  @pieceMealWindows @linked.scope, false
              else
                #creating windows with parent markers
                @parentScope = @markersScope
                @watchIdKey @parentScope
                if isCreatingFromScratch
                  @createAllNewWindows @markersScope, true, 'markerModels', false
                else
                  @pieceMealWindows @markersScope, true, 'markerModels', false

          watchIdKey: (scope)=>
            @setIdKey scope
            scope.$watch 'idKey', (newValue, oldValue) =>
              if (newValue != oldValue and !newValue?)
                @idKey = newValue
                @rebuildAll(scope, true, true)


          createAllNewWindows: (scope, hasGMarker, modelsPropToIterate = 'models', isArray = false) =>
            @models = scope.models
            if @firstTime
              @watchModels scope
              @watchDestroy scope
            @setContentKeys(scope.models) #only setting content keys once per model array

            @cleanOnResolve _async.waitOrGo @, =>
              _async.each scope.models, (model) =>
                gMarker = if hasGMarker then scope[modelsPropToIterate][[model[@idKey]]]?.gMarker else undefined
#                throw 'Unable to get gMarker from scope!!' unless gMarker
                @createWindow(model, gMarker, @gMap)
            .then =>
              @firstTime = false

          pieceMealWindows: (scope, hasGMarker, modelsPropToIterate = 'models', isArray = true)=>
            return if scope.$$destroyed or @isClearing
            return if @updateInProgress()
#            doChunk = if @existingPieces? then false else _async.defaultChunkSize
            doChunk = _async.defaultChunkSize
            @models = scope.models
            if scope? and scope.models? and scope.models.length > 0 and @windows.length > 0
              @figureOutState @idKey, scope, @windows, @modelKeyComparison, (state) =>
                payload = state
                @cleanOnResolve _async.waitOrGo @, =>
                  _async.each payload.removals, (child)=>
                    if child?
                      @windows.remove(child.id)
                      child.destroy(true) if child.destroy?
                  ,false
                  .then =>
                    #add all adds via creating new ChildMarkers which are appended to @markers
                    _async.each payload.adds, (modelToAdd) =>
                      gMarker = scope[modelsPropToIterate].get(modelToAdd[@idKey])?.gMarker
                      throw 'Gmarker undefined' unless gMarker
                      @createWindow(modelToAdd, gMarker, @gMap)
                    ,false
            else
              @rebuildAll(@scope, true, true)

          setContentKeys: (models)=>
            if(models.length > 0)
              @contentKeys = Object.keys(models[0])

          createWindow: (model, gMarker, gMap)=>
            childScope = @linked.scope.$new(false)
            @setChildScope(childScope, model)
            childScope.$watch('model', (newValue, oldValue) =>
              if(newValue != oldValue)
                @setChildScope(childScope, newValue)

            , true)
            fakeElement =
              html: =>
                @interpolateContent(@linked.element.html(), model)
            @DEFAULTS = if @markersScope then model[@optionsKey] or {} else @DEFAULTS
            opts = @createWindowOptions gMarker, childScope, fakeElement.html(), @DEFAULTS
            child = new WindowChildModel model, childScope, opts, @isIconVisibleOnClick, gMap, @markersScope?.markerModels.get(model[@idKey])?.scope, fakeElement, false, true

            unless model[@idKey]?
              @$log.error('Window model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.')
              return
            @windows.put(model[@idKey], child)
            child

          setChildScope: (childScope, model) =>
            _.each @scopePropNames, (name) =>
              nameKey = name + 'Key'
              newValue = if @[nameKey] == 'self' then model else model[@[nameKey]]
              if(newValue != childScope[name])
                childScope[name] = newValue
            childScope.model = model

          interpolateContent: (content, model) =>
            if @contentKeys == undefined or @contentKeys.length == 0
              return
            exp = $interpolate(content)
            interpModel = {}
            interpModel[key] = model[key] for key in @contentKeys
            exp(interpModel)

        WindowsParentModel
  ]
