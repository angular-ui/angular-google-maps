@ngGmapModule "directives.api.models.parent", ->
    class @MarkersParentModel extends directives.api.models.parent.IMarkerParentModel
        @include directives.api.utils.ModelsWatcher
        constructor: (scope, element, attrs, mapCtrl, $timeout) ->
            super(scope, element, attrs, mapCtrl, $timeout)
            self = @
            @markers = {}
            @gMarkerManager = undefined
            @bigGulp = directives.api.utils.AsyncProcessor
            @$timeout = $timeout
            @$log.info @
            @doRebuildAll = if @scope.doRebuildAll? then @scope.doRebuildAll else true
            @scope.$watch 'doRebuildAll', (newValue, oldValue) =>
                if (newValue != oldValue)
                    @doRebuildAll = newValue

        onTimeOut: (scope)=>
            @watch('models', scope)
            @watch('doCluster', scope)
            @watch('clusterOptions', scope)
            @watch('fit', scope)
            @createMarkersFromScratch(scope)

        validateScope: (scope)=>
            modelsNotDefined = angular.isUndefined(scope.models) or scope.models == undefined
            if(modelsNotDefined)
                @$log.error(@constructor.name + ": no valid models attribute found")

            super(scope) or modelsNotDefined

        createMarkersFromScratch: (scope) =>
            if scope.doCluster? and scope.doCluster == true
                if scope.clusterOptions?
                    if @gMarkerManager == undefined
                        @gMarkerManager = new directives.api.managers.ClustererMarkerManager(@mapCtrl.getMap(),
                                undefined,
                                scope.clusterOptions)
                    else
                        @gMarkerManager = new directives.api.managers.ClustererMarkerManager(@mapCtrl.getMap(),
                                undefined,
                                scope.clusterOptions) if @gMarkerManager.opt_options != scope.clusterOptions
                else
                    @gMarkerManager = new directives.api.managers.ClustererMarkerManager(@mapCtrl.getMap())
            else
                @gMarkerManager = new directives.api.managers.MarkerManager(@mapCtrl.getMap())

            @bigGulp.handleLargeArray(scope.models, (model) =>
                scope.doRebuild = true
                @newChildMarker(model, scope)
            , (()->) #nothing for pause
            , () => #handle done callBack
                @gMarkerManager.draw()
                @fit() if angular.isDefined(@attrs.fit) and scope.fit? and scope.fit
                scope.markerModels = @markers #for other directives like windows
            )


        reBuildMarkers: (scope) =>
            if(!scope.doRebuild and scope.doRebuild != undefined)
                return
            @onDestroy(scope)#clean @markers
            @createMarkersFromScratch(scope)

        pieceMealMarkers: (scope)=>
            if @scope.models? and @scope.models.length > 0 and @markers.length > 0 #and @scope.models.length == @markers.length
                payload = @modelsToAddRemovePayload(scope, @markers, @modelKeyComparison, 'gMarker')

                #payload contains added, removals and flattened (existing models with their gProp appended)
                #remove all removals from gMarkerManager, clean up scope (destroy), finally remove from @markers
                _.each payload.removals, (modelToRemove)=>
                    toDestroy = _.find @markers, (m)=>
                        m.$id == modelToRemove.$id
                    @gMarkerManager.remove(@markers[toDestroy.$id]) if @markers[toDestroy.$id]?
                    toDestroy.destroy()
                    delete @markers[toDestroy.$id]

                #add all adds via creating new ChildMarkers which are appended to @markers
                _.each payload.adds, (modelToAdd) =>
                    @newChildMarker(modelToAdd, scope)
                #finally redraw
                @gMarkerManager.draw()
                scope.markerModels =  @markers #for other directives like windows
            else
                @reBuildMarkers(scope)

        newChildMarker: (model, scope)=>
            child = new directives.api.models.child.MarkerChildModel(model, scope, @mapCtrl,
                    @$timeout,
                    @DEFAULTS, @doClick, @gMarkerManager)
            @$log.info('child', child, 'markers', @markers)
            @markers[child.scope.$id] = child
            child

        onWatch: (propNameToWatch, scope, newValue, oldValue) =>
            if propNameToWatch == 'models'
                unless @didModelsChange newValue, oldValue, @modelKeyComparison
                    return
            if propNameToWatch == 'options' and newValue? #do we want to rebuild if options has changed?
                @DEFAULTS = newValue
                return

            if @doRebuildAll
                @reBuildMarkers(scope)
            else
                @pieceMealMarkers(scope)

        onDestroy: (scope)=>
            #need to figure out how to handle individual destroys
            #slap index to the external model so that when they pass external back
            #for destroy we have a lookup?
            #this will require another attribute for destroySingle(marker)
            _.each _.values(@markers), (model)->
                model.destroy() if model?
            delete @markers
            @markers = {}
            @gMarkerManager.clear() if @gMarkerManager?

        fit: ()=>
            if (@mapCtrl and @markers? and @markers.length)
                bounds = new google.maps.LatLngBounds();
                everSet = false
                _.each @markers, (childModelMarker) =>
                    if childModelMarker.gMarker?
                        everSet = true unless everSet
                        bounds.extend(childModelMarker.gMarker.getPosition())
                @mapCtrl.getMap().fitBounds(bounds) if everSet

