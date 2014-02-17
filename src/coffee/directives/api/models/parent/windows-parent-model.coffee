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
            scope.$watch 'models', (newValue, oldValue) =>
                #check to make sure that the newValue Array is really a set of new objects
                if @didModelsChange(newValue, oldValue)
                    @destroy()
                    @createChildScopesWindows()

        watchDestroy: (scope)=>
            scope.$on "$destroy", =>
                @destroy()

        destroy:() =>
            _.each @windows, (model) =>
                model.destroy()
            delete @windows
            @windows = []
            @windowsIndex = 0

        watchOurScope: (scope) =>
            _.each @scopePropNames, (name) =>
                nameKey = name + 'Key'
                @[nameKey] = if typeof scope[name] == 'function' then scope[name]() else scope[name]
                @watch(scope, name, nameKey)

        onMarkerModelsReady: (scope) =>
            @destroy()
            @models = scope.models
            if(@firstTime)
                @watchDestroy scope
            @setContentKeys scope.models #only setting content keys once per model array
            @bigGulp.handleLargeArray scope.markerModels, (mm) =>
                @createWindow mm.model, mm.gMarker, @gMap
            , (()->), () => #handle done callBack
                @firstTime = false

        createChildScopesWindows: =>
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
            markersScope = if @linked.ctrls.length > 1 and @linked.ctrls[1]? then @linked.ctrls[1].getMarkersScope() else undefined

            modelsNotDefined = angular.isUndefined(@linked.scope.models)

            if modelsNotDefined and (markersScope == undefined or (markersScope.markerModels == undefined and markersScope.models == undefined))
                @$log.info("No models to create windows from! Need direct models or models derrived from markers!")
                return
            if @gMap?
                #at the very least we need a Map, the marker is optional as we can create Windows without markers
                if @linked.scope.models?
                    #we are creating windows with no markers
                    @models = @linked.scope.models
                    if(@firstTime)
                        @watchModels(@linked.scope)
                        @watchDestroy(@linked.scope)
                    @setContentKeys(@linked.scope.models) #only setting content keys once per model array
                    @bigGulp.handleLargeArray(@linked.scope.models, (model) =>
                        @createWindow(model, undefined, @gMap)
                    , (()->), () => #handle done callBack
                        @firstTime = false
                    )
                else
                    #creating windows with parent markers
                    markersScope.onMarkerModelsReady = @onMarkerModelsReady
                    @onMarkerModelsReady(markersScope) if markersScope.isMarkerModelsReady



        setContentKeys: (models)=>
            if(models.length > 0)
                @contentKeys = Object.keys(models[0])

        createWindow: (model, gMarker, gMap)=>
            ###
            Create ChildScope to Mimmick an ng-repeat created scope, must define the below scope
                  scope= {
                    coords: '=coords',
                    show: '&show',
                    templateUrl: '=templateurl',
                    templateParameter: '=templateparameter',
                    isIconVisibleOnClick: '=isiconvisibleonclick',
                    closeClick: '&closeclick'
                }
            ###
            childScope = @linked.scope.$new(false)
            @setChildScope(childScope, model)
            childScope.$watch('model', (newValue, oldValue) =>
                if(newValue != oldValue)
                    @setChildScope(childScope, newValue)
            , true)
            parsedContent = @interpolateContent(@linked.element.html(), model)
            opts = @createWindowOptions(gMarker, childScope, parsedContent, @DEFAULTS)
            @windows.push new directives.api.models.child.WindowChildModel(childScope, opts, @isIconVisibleOnClick,
                    gMap, gMarker, @$http, @$templateCache, @$compile, undefined ,true)

        setChildScope: (childScope, model) =>
            for name in @scopePropNames
                do (name) =>
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