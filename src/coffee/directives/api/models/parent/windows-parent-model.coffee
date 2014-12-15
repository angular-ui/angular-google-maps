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
            #if there is a markersScope we only want to start our changes when markers is done
            # therefore we wait on markerModelsUpdate to change
            itemToWatch =  if @markersScope? then 'markerModelsUpdate' else 'models'
            scope.$watch itemToWatch, (newValue, oldValue) =>
              #check to make sure that the newValue Array is really a set of new objects
              if not _.isEqual(newValue, oldValue) or @firstWatchModels
                @firstWatchModels = false
                if @doRebuildAll or @doINeedToWipe(scope.models)
                  @rebuildAll(scope, true, true)
                else
                  doScratch = @windows.length == 0
                  if @existingPieces?
                    _.last(@existingPieces._content).then => @createChildScopesWindows doScratch
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
            _async.promiseLock @, uiGmapPromise.promiseTypes.delete, undefined, undefined, =>
              _async.each @windows.values(), (child) =>
                child.destroy()
              , false
              .then =>
                delete @windows if doDelete
                @windows = new PropMap()

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
              @$log.error('No models to create windows from! Need direct models or models derived from markers!')
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

            return if @didQueueInitPromise(@,scope)

            maybeCanceled = null
            _async.promiseLock @, uiGmapPromise.promiseTypes.create, 'createAllNewWindows',
              ((canceledMsg) -> maybeCanceled = canceledMsg), =>
                _async.each scope.models, (model) =>
                  gMarker = if hasGMarker then @getItem(scope, modelsPropToIterate, model[@idKey])?.gMarker else undefined
                  unless maybeCanceled
                    $log.error 'Unable to get gMarker from markersScope!' if not gMarker and @markersScope
                    @createWindow(model, gMarker, @gMap)
                  maybeCanceled
                , _async.chunkSizeFrom scope.chunk
                .then =>
                  @firstTime = false

          pieceMealWindows: (scope, hasGMarker, modelsPropToIterate = 'models', isArray = true)=>
            return if scope.$$destroyed
            maybeCanceled = null
            payload = null
            @models = scope.models

            if scope? and scope.models? and scope.models.length > 0 and @windows.length > 0

              _async.promiseLock @, uiGmapPromise.promiseTypes.update, 'pieceMeal', ((canceledMsg) -> maybeCanceled = canceledMsg), =>
                uiGmapPromise.promise((=> @figureOutState @idKey, scope, @windows, @modelKeyComparison))
                .then (state) =>
                  payload = state
                  _async.each payload.removals, (child)=>
                    if child?
                      @windows.remove(child.id)
                      child.destroy(true) if child.destroy?
                      maybeCanceled
                  , _async.chunkSizeFrom scope.chunk
                .then =>
                  #add all adds via creating new ChildMarkers which are appended to @markers
                  _async.each payload.adds, (modelToAdd) =>
                    gMarker = @getItem(scope, modelsPropToIterate, modelToAdd[@idKey])?.gMarker
                    throw 'Gmarker undefined' unless gMarker
                    @createWindow(modelToAdd, gMarker, @gMap)
                    maybeCanceled

            else
              $log.debug('pieceMealWindows: rebuildAll')
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
            @DEFAULTS = @scopeOrModelVal(@optionsKey, @scope, model) or {}
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
