###
	Windows directive where many windows map to the models property
###
@ngGmapModule "directives.api.models.parent", ->
    class @WindowsParentModel extends directives.api.models.parent.IWindowParentModel
        @include directives.api.utils.ModelsWatcher
        constructor: (scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache, $interpolate) ->
            super(scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache, $interpolate)
            self = @
            @$interpolate = $interpolate
            @windows = []
            @windwsIndex = 0
            @scopePropNames = ['show', 'coords', 'templateUrl', 'templateParameter',
                               'isIconVisibleOnClick', 'closeClick']
            #setting up local references to propety keys IE: @coordsKey
            @[name + 'Key'] = undefined for name in @scopePropNames
            @linked = new directives.api.utils.Linked(scope, element, attrs, ctrls)
            @models = undefined
            @contentKeys = undefined #model keys to parse html angular content
            @isIconVisibleOnClick = undefined
            @firstTime = true
            @bigGulp = directives.api.utils.AsyncProcessor
            @$log.info(self)


            @$timeout(=>
                @watchOurScope(scope)
                @doRebuildAll = if scope.doRebuildAll? then scope.doRebuildAll else true
                scope.$watch 'doRebuildAll', (newValue, oldValue) =>
                    if (newValue != oldValue)
                        @doRebuildAll = newValue
                @createChildScopesWindows()
            , 50)

        #watch this scope(Parent to all WindowModels), these updates reflect expression / Key changes
        #thus they need to be pushed to all the children models so that they are bound to the correct objects / keys
        watch: (scope, name, nameKey) =>
            scope.$watch(name, (newValue, oldValue) =>
                if (newValue != oldValue)
                    @[nameKey] = if typeof newValue == 'function' then newValue() else newValue
                    for model in @windows
                        do(model) =>
                            model.scope[name] = if @[nameKey] == 'self' then model else model[@[nameKey]]
            , true)

        watchModels: (scope) =>
            scope.$watch('models', (newValue, oldValue) =>
                #check to make sure that the newValue Array is really a set of new objects
                if @didModelsChange(newValue, oldValue)
                    if @doRebuildAll
                        @rebuildAll(scope, true, true)
                    else
                        @createChildScopesWindows(false)
            , true)

        rebuildAll: (scope, doCreate, doDelete) =>
            @bigGulp.handleLargeArray @windows, (model) =>
                model.destroy()
            , (()->), () => #handle done callBack
                delete @windows if doDelete
                @windows = []
                @windowsIndex = 0
                @createChildScopesWindows() if doCreate

        watchDestroy: (scope)=>
            scope.$on "$destroy", =>
                @rebuildAll(scope, false, true)

        watchOurScope: (scope) =>
            _.each @scopePropNames, (name) =>
                nameKey = name + 'Key'
                @[nameKey] = if typeof scope[name] == 'function' then scope[name]() else scope[name]
                @watch(scope, name, nameKey)

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
            @gMap = @linked.ctrls[0].getMap()

            if @linked.ctrls[1]?
                markersScope = if @linked.ctrls.length > 1 then @linked.ctrls[1].getMarkersScope() else undefined
            modelsNotDefined = angular.isUndefined(@linked.scope.models)

            if modelsNotDefined and (markersScope == undefined or (markersScope.markerModels == undefined or markersScope.models == undefined))
                @$log.error("No models to create windows from! Need direct models or models derrived from markers!")
                return
            if @gMap?
                #at the very least we need a Map, the marker is optional as we can create Windows without markers
                if @linked.scope.models?
                    #we are creating windows with no markers
                    if isCreatingFromScratch
                        @createAllNewWindows @linked.scope, false
                    else
                        @pieceMealWindows @linked.scope, false
                else
                    #creating windows with parent markers
                    if isCreatingFromScratch
                        @createAllNewWindows markersScope, true, 'markerModels', false
                    else
                        @pieceMealWindows markersScope, true, 'markerModels', false


        createAllNewWindows: (scope, hasGMarker, modelsPropToIterate = 'models', isArray = true) =>
            @models = scope.models
            if @firstTime
                @watchModels scope
                @watchDestroy scope
            @setContentKeys(scope.models) #only setting content keys once per model array
            toRender = @transformModels scope, modelsPropToIterate, isArray
            @bigGulp.handleLargeArray toRender, (model) =>
                gMarker = if hasGMarker then model.gMarker else undefined
                windowModel = if hasGMarker then model.model else model
                @createWindow(windowModel, gMarker, @gMap)
            , (()->), () => #handle done callBack
                @firstTime = false



        pieceMealWindows: (scope, hasGMarker, modelsPropToIterate = 'models', isArray = true)=>
            @models = scope.models
            toRender = @transformModels scope, modelsPropToIterate, isArray
            if toRender? and toRender.length > 0 and @windows.length > 0
                payload = @modelsToAddRemovePayload(scope, @windows, @modelKeyComparison)
                #                payload = {}
                #payload contains added, removals and flattened (existing models with their gProp appended)
                if payload.removals? and payload.removals.length > 0
                    _.each payload.removals, (modelToRemove)=>
                        toDestroy = _.find @windows, (m)=>
                            m.scope.$id == modelToRemove.$id
                        toDestroy.destroy(true) if toDestroy?
                        toSpliceIndex = _.indexOfObject @windows, toDestroy, (obj1, obj2) ->
                            obj1.$id == obj2.$id
                        @windows.splice(toSpliceIndex, 1) if (toSpliceIndex > -1)

                #add all adds via creating new ChildMarkers which are appended to @markers
                if payload.adds? and payload.adds.length > 0
                    _.each payload.adds, (modelToAdd) =>
                        gMarker = if hasGMarker then modelToAdd.gMarker else undefined
                        windowModel = if hasGMarker then modelToAdd.model else modelToAdd
                        @createWindow(windowModel, gMarker, @gMap)
            else
                @createAllNewWindows(scope, hasGMarker, modelsPropToIterate)

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
            parsedContent = @interpolateContent(@linked.element.html(), model)
            opts = @createWindowOptions(gMarker, childScope, parsedContent, @DEFAULTS)
            @windows.push new directives.api.models.child.WindowChildModel(model, childScope, opts,
                    @isIconVisibleOnClick,
                    gMap, gMarker, @$http, @$templateCache, @$compile, undefined, true)

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
            exp = @$interpolate(content)
            interpModel = {}
            interpModel[key] = model[key] for key in @contentKeys
            exp(interpModel)