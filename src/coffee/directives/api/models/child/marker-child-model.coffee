@ngGmapModule "directives.api.models.child", ->
	class @MarkerChildModel extends directives.api.utils.ModelKey
        @include directives.api.utils.GmapUtil
        constructor:(@model, @parentScope, @gMap, @$timeout, @defaults, @doClick, @gMarkerManager)->
            self = @
            super(@parentScope.$new(false))
            @iconKey = @parentScope.icon
            @coordsKey = @parentScope.coords
            @clickKey = @parentScope.click()
            @labelContentKey = @parentScope.labelContent
            @optionsKey = @parentScope.options
            @labelOptionsKey = @parentScope.labelOptions

            @scope.model = @model
            @setMyScope(@model, undefined, true)
            @createMarker(@model)

            @scope.$watch('model',(newValue, oldValue) =>
                if (newValue != oldValue)
                    @setMyScope(newValue,oldValue)
            ,true)

            @$log = directives.api.utils.Logger
            @$log.info(self)
            @watchDestroy(@scope)

        setMyScope:(model, oldModel = undefined,isInit = false) =>
            @maybeSetScopeValue('icon',model,oldModel,@iconKey,@evalModelHandle,isInit,@setIcon)
            @maybeSetScopeValue('coords',model,oldModel,@coordsKey,@evalModelHandle,isInit,@setCoords)
            @maybeSetScopeValue('labelContent',model,oldModel,@labelContentKey,@evalModelHandle,isInit)
            @maybeSetScopeValue('click',model,oldModel,@clickKey,@evalModelHandle,isInit)
            @createMarker(model,oldModel,isInit)

        createMarker:(model, oldModel = undefined,isInit = false)=>
            @maybeSetScopeValue('options',model,oldModel,@optionsKey,(lModel,lModelKey) =>
                if lModel == undefined
                    return undefined
                value = if lModelKey == 'self' then lModel else lModel[lModelKey]
                if value == undefined # we still dont have a value see if this is something up the tree or default it
                    value = if lModelKey == undefined then @defaults else @scope.options
                else
                    value
            ,isInit,@setOptions)


        maybeSetScopeValue:(scopePropName,model,oldModel,modelKey,evaluate,isInit,gSetter = undefined) =>
            if oldModel == undefined
                @scope[scopePropName] = evaluate(model,modelKey)
                unless isInit
                    gSetter(@scope) if gSetter?
                return

            oldVal = evaluate(oldModel,modelKey)
            newValue = evaluate(model,modelKey)
            if(newValue != oldVal and @scope[scopePropName] != newValue)
                @scope[scopePropName] = newValue
                unless isInit
                    gSetter(@scope) if gSetter?
                    @gMarkerManager.draw()

        destroy:() =>
            @scope.$destroy()

        setCoords:(scope) =>
            if(scope.$id != @scope.$id or @gMarker == undefined)
                return
            if (scope.coords?)
                @gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude))
                @gMarker.setVisible(scope.coords.latitude? and scope.coords.longitude?)
                @gMarkerManager.remove(@gMarker)
                @gMarkerManager.add(@gMarker)
            else
                @gMarkerManager.remove(@gMarker)

        setIcon:(scope) =>
            if(scope.$id != @scope.$id or @gMarker == undefined)
                return
            @gMarkerManager.remove(@gMarker)
            @gMarker.setIcon(scope.icon)
            @gMarkerManager.add(@gMarker)
            @gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude))
            @gMarker.setVisible(scope.coords.latitude and scope.coords.longitude?)

        setOptions:(scope) =>
            if(scope.$id != @scope.$id)
                return

            if @gMarker?
                @gMarkerManager.remove(@gMarker)
                delete @gMarker
            unless scope.coords ? scope.icon? scope.options?
                return
            @opts = @createMarkerOptions(scope.coords, scope.icon, scope.options)

            delete @gMarker
            if @isLabelDefined(scope)
                @gMarker = new MarkerWithLabel(@setLabelOptions(@opts, scope))
            else
                @gMarker = new google.maps.Marker(@opts)

            @gMarkerManager.add(@gMarker)
            google.maps.event.addListener(@gMarker, 'click', =>
                if @doClick and @scope.click?
                    @scope.click()
            )

        isLabelDefined:(scope) =>
            scope.labelContent?

        setLabelOptions:(opts, scope) =>
            opts.labelAnchor= @getLabelPositionPoint(scope.labelAnchor)
            opts.labelClass= scope.labelClass
            opts.labelContent= scope.labelContent
            opts

        watchDestroy:(scope)=>
            scope.$on("$destroy", =>
                if @gMarker? #this is possible due to AsyncProcessor in that we created some Children but no gMarker yet
                    @gMarkerManager.remove(@gMarker)
                    delete @gMarker
                self = undefined
            )