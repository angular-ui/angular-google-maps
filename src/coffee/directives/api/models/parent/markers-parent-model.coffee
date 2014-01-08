@ngGmapModule "directives.api.models.parent", ->
    class @MarkersParentModel extends directives.api.models.parent.IMarkerParentModel
        @include directives.api.utils.ModelsWatcher
        @include directives.api.utils.ModelKey
        constructor: (scope, element, attrs, mapCtrl, $timeout) ->
            super(scope, element, attrs, mapCtrl, $timeout)
            self = @
            @markers = []
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
                @newChildMarker(model,scope)
            , (()->) #nothing for pause
            , () => #handle done callBack
                @gMarkerManager.draw()
                @fit() if angular.isDefined(@attrs.fit) and scope.fit? and scope.fit
            )


        reBuildMarkers: (scope) =>
            if(!scope.doRebuild and scope.doRebuild != undefined)
                return
            _.each @markers, (oldM) =>
                oldM.destroy()
            delete @markers
            @markers = []
            @gMarkerManager.clear() if @gMarkerManager?
            @createMarkersFromScratch(scope)

        pieceMealMarkers: (scope)=>
            if @scope.models? and @scope.models.length > 0 and @markers.length > 0
                payload = @modelsToAddRemovePayload(scope, @markers, @modelKeyComparison, 'gMarker')

                #clean up items to remove, first find where, then
                _.each payload.removals, (modelToRemove)=>
                    toDestroy = _.find @markers, (m)=>
                        m.$id == modelToRemove.$id
                    @gMarkerManager.remove(toDestroy.gMarker) if toDestroy.gMarker?
                    toDestroy.destroy()
                @markers = _.differenceObjects @markers, payload.removals, (obj1, obj2) ->
                    obj1.$id == obj2.$id

                #add stuff
                _.each payload.adds, (modelToAdd) =>
                    @newChildMarker(modelToAdd,scope)
                #finally redraw
                @gMarkerManager.draw()
            else
                @reBuildMarkers(scope)

        newChildMarker:(model,scope)=>
            child = new directives.api.models.child.MarkerChildModel( model, scope, @mapCtrl,
                    @$timeout,
                    @DEFAULTS, @doClick, @gMarkerManager)
            @$log.info('child', child, 'markers', @markers)
            @markers.push(child)
            child

        onWatch: (propNameToWatch, scope, newValue, oldValue) =>
            if propNameToWatch == 'models'
                unless @didModelsChange(newValue, oldValue)
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
            model.destroy() for model in @markers
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

