angular.module("google-maps.api.managers")
.factory "ClustererMarkerManager", [ "BaseObject", "Logger", (BaseObject,Logger) ->
    class ClustererMarkerManager extends BaseObject
        constructor: (gMap, opt_markers, opt_options, opt_events) ->
            super()
            self = @
            @opt_options = opt_options
            if opt_options? and opt_markers == undefined
                @clusterer = new MarkerClusterer(gMap, undefined, opt_options)
            else if opt_options? and opt_markers?
                @clusterer = new MarkerClusterer(gMap, opt_markers, opt_options)
            else
                @clusterer = new MarkerClusterer(gMap)

            if angular.isDefined(opt_events) and opt_events? and angular.isObject(opt_events)
                for eventName, eventHandler of opt_events
                    if opt_events.hasOwnProperty(eventName) and angular.isFunction(opt_events[eventName])
                        google.maps.event.addListener @clusterer, eventName, opt_events[eventName]

            @clusterer.setIgnoreHidden(true)
            @$log = Logger
            @noDrawOnSingleAddRemoves = true
            @$log.info(@)
        add: (gMarker)=>
            @clusterer.addMarker(gMarker, @noDrawOnSingleAddRemoves)
        addMany: (gMarkers)=>
            @clusterer.addMarkers(gMarkers)
        remove: (gMarker)=>
            @clusterer.removeMarker(gMarker, @noDrawOnSingleAddRemoves)
        removeMany: (gMarkers)=>
            @clusterer.addMarkers(gMarkers)
        draw: ()=>
            @clusterer.repaint()
        clear: ()=>
            @clusterer.clearMarkers()
            @clusterer.repaint()
    ClustererMarkerManager
]