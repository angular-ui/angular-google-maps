###
	Basic Directive api for a marker. Basic in the sense that this directive contains 1:1 on scope and model. 
	Thus there will be one html element per marker within the directive.
###
@ngGmapModule "directives.api.models.parent", ->
    class @MarkerParentModel extends directives.api.models.parent.IMarkerParentModel
        @include directives.api.utils.GmapUtil
        constructor: (scope, element, attrs, mapCtrl, $timeout) ->
            super(scope, element, attrs, mapCtrl, $timeout)
            self = @

        onTimeOut:(scope)=>
            opts = @createMarkerOptions(scope.coords, scope.icon, scope.options, @mapCtrl.getMap())
            #using scope.$id as the identifier for a marker as scope.$id should be unique, no need for an index (as it is the index)
            @scope.gMarker = new google.maps.Marker(opts)
            
            google.maps.event.addListener @scope.gMarker, 'click', =>
                if @doClick and scope.click?
                    @$timeout =>
                        @scope.click()

            @setEvents(@scope.gMarker, scope)
            @$log.info(@)

        onWatch: (propNameToWatch, scope) =>
            switch propNameToWatch
                when 'coords'
                    if (scope.coords? and @scope.gMarker?)
                        @scope.gMarker.setMap(@mapCtrl.getMap())
                        @scope.gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude))
                        @scope.gMarker.setVisible(scope.coords.latitude? and scope.coords.longitude?)
                        @scope.gMarker.setOptions(scope.options)
                    else
                        # Remove marker
                        @scope.gMarker.setMap(null)
                when 'icon'
                    if (scope.icon? and scope.coords? and @scope.gMarker?)
                        @scope.gMarker.setOptions(scope.options)
                        @scope.gMarker.setIcon(scope.icon)
                        @scope.gMarker.setMap(null)
                        @scope.gMarker.setMap(@mapCtrl.getMap())
                        @scope.gMarker.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude))
                        @scope.gMarker.setVisible(scope.coords.latitude and scope.coords.longitude?)
                when 'options'
                    if scope.coords? and scope.icon? and scope.options
                        @scope.gMarker.setMap(null) if @scope.gMarker?
                        delete @scope.gMarker
                        @scope.gMarker = new google.maps.Marker(@createMarkerOptions(scope.coords, scope.icon, scope.options,
                                @mapCtrl.getMap()))

        onDestroy: (scope)=>
            if @scope.gMarker == undefined
                self = undefined
                return
            #remove from gMaps and then free resources
            @scope.gMarker.setMap(null)
            delete @scope.gMarker
            self = undefined

        setEvents: (marker, scope) ->
            if angular.isDefined(scope.events) and scope.events? and angular.isObject(scope.events)
                _.compact _.each scope.events, (eventHandler, eventName) ->
                    if scope.events.hasOwnProperty(eventName) and angular.isFunction(scope.events[eventName])
                        google.maps.event.addListener(marker, eventName, -> eventHandler.apply(scope, [marker, eventName, arguments]))