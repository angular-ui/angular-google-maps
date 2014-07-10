###
	Windows directive where many windows map to the models property
###
angular.module("google-maps.directives.api.models.parent")
.factory "WindowsParentModel",
        ["IWindowParentModel", "ModelsWatcher", "PropMap", "WindowChildModel", "Linked",
            (IWindowParentModel, ModelsWatcher, PropMap, WindowChildModel, Linked) ->
                class WindowsParentModel extends IWindowParentModel
                    @include ModelsWatcher
                    constructor: (scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache, @$interpolate) ->
                        super(scope, element, attrs, ctrls, $timeout, $compile, $http, $templateCache)
                        self = @
                        @windows = new PropMap()

                        @scopePropNames = ['show', 'coords', 'templateUrl', 'templateParameter',
                                           'isIconVisibleOnClick', 'closeClick']
                        #setting up local references to propety keys IE: @coordsKey
                        _.each @scopePropNames, (name) =>
                            @[name + 'Key'] = undefined
                        @linked = new Linked(scope, element, attrs, ctrls)
                        @models = undefined
                        @contentKeys = undefined #model keys to parse html angular content
                        @isIconVisibleOnClick = undefined
                        @firstTime = true
                        @$log.info(self)
                        @parentScope = undefined


                        @$timeout(=>
                            @watchOurScope(scope)
                            @doRebuildAll = if @scope.doRebuildAll? then @scope.doRebuildAll else false
                            scope.$watch 'doRebuildAll', (newValue, oldValue) =>
                                if (newValue != oldValue)
                                    @doRebuildAll = newValue

                            @createChildScopesWindows()
                        , 50)

                    #watch this scope(Parent to all WindowModels), these updates reflect expression / Key changes
                    #thus they need to be pushed to all the children models so that they are bound to the correct objects / keys
                    watch: (scope, name, nameKey) =>
                        scope.$watch name, (newValue, oldValue) =>
                            if (newValue != oldValue)
                                @[nameKey] = if typeof newValue == 'function' then newValue() else newValue
                                _async.each _.values(@windows), (model) =>
                                    model.scope[name] = if @[nameKey] == 'self' then model else model[@[nameKey]]
                                , () =>

                    watchModels: (scope) =>
                        scope.$watch 'models', (newValue, oldValue) =>
                            #check to make sure that the newValue Array is really a set of new objects
                            unless _.isEqual(newValue, oldValue)
                                if @doRebuildAll or @doINeedToWipe(newValue)
                                    @rebuildAll(scope, true, true)
                                else
                                    @createChildScopesWindows(false)

                    doINeedToWipe: (newValue) =>
                        newValueIsEmpty = if newValue? then newValue.length == 0 else true
                        @windows.length > 0 and newValueIsEmpty

                    rebuildAll: (scope, doCreate, doDelete) =>
                        _async.each @windows.values(), (model) =>
                            model.destroy()
                        , () => #handle done callBack
                            delete @windows if doDelete
                            @windows = new PropMap()
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
                                @watchIdKey @linked.scope
                                if isCreatingFromScratch
                                    @createAllNewWindows @linked.scope, false
                                else
                                    @pieceMealWindows @linked.scope, false
                            else
                                #creating windows with parent markers
                                @parentScope = markersScope
                                @watchIdKey @parentScope
                                if isCreatingFromScratch
                                    @createAllNewWindows markersScope, true, 'markerModels', false
                                else
                                    @pieceMealWindows markersScope, true, 'markerModels', false

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
                        _async.each scope.models, (model) =>
                            gMarker = if hasGMarker
                            then scope[modelsPropToIterate][[model[@idKey]]].gMarker else undefined
                            @createWindow(model, gMarker, @gMap)
                        , () => #handle done callBack
                            @firstTime = false



                    pieceMealWindows: (scope, hasGMarker, modelsPropToIterate = 'models', isArray = true)=>
                        @models = scope.models
                        if scope? and scope.models? and scope.models.length > 0 and @windows.length > 0
                            @figureOutState @idKey, scope, @windows, @modelKeyComparison, (state) =>
                                payload = state
                                _async.each payload.removals, (child)=>
                                    if child?
                                        child.destroy() if child.destroy?
                                        @windows.remove(child.id)
                                , () =>
                                    #add all adds via creating new ChildMarkers which are appended to @markers
                                    _async.each payload.adds, (modelToAdd) =>
                                        gMarker = scope[modelsPropToIterate][modelToAdd[@idKey]].gMarker
                                        @createWindow(modelToAdd, gMarker, @gMap)
                                    , ()=>
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
                        opts = @createWindowOptions gMarker, childScope, fakeElement.html(), @DEFAULTS
                        child = new WindowChildModel model, childScope, opts, @isIconVisibleOnClick, gMap, gMarker, fakeElement, true, true

                        unless model[@idKey]?
                            @$log.error("Window model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.")
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
                        exp = @$interpolate(content)
                        interpModel = {}
                        interpModel[key] = model[key] for key in @contentKeys
                        exp(interpModel)

                WindowsParentModel
        ]
