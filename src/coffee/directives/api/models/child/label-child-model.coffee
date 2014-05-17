angular.module("google-maps.directives.api.models.child")
.factory "MarkerLabelChildModel", [ "BaseObject", "GmapUtil", (BaseObject, GmapUtil) ->
    class MarkerLabelChildModel extends BaseObject
        @include GmapUtil
        constructor: (gMarker, opt_options) ->
            super()
            self = @

            @marker = gMarker
            @marker.set("labelContent", opt_options.labelContent)
            @marker.set("labelAnchor", @getLabelPositionPoint(opt_options.labelAnchor))
            @marker.set("labelClass", opt_options.labelClass || 'labels')
            @marker.set("labelStyle", opt_options.labelStyle || { opacity: 100 })
            @marker.set("labelInBackground", opt_options.labelInBackground || false;)

            if !opt_options.labelVisible
                @marker.set("labelVisible", true)

            if !opt_options.raiseOnDrag
                @marker.set("raiseOnDrag", true)

            if !opt_options.clickable
                @marker.set("clickable", true)

            if !opt_options.draggable
                @marker.set("draggable", false)

            if !opt_options.optimized
                @marker.set("optimized", false)

            #TODO: This should be overrideable and only gets set as a default if nothing is defined
            opt_options.crossImage = opt_options.crossImage ? document.location.protocol + "//maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png";
            opt_options.handCursor = opt_options.handCursor ? document.location.protocol + "//maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur";

            @markerLabel = new MarkerLabel_(@marker, opt_options.crossImage, opt_options.handCursor)

            @marker.set("setMap", (theMap)->
                google.maps.Marker.prototype.setMap.apply(this, arguments);
                self.markerLabel.setMap(theMap)
            )

            @marker.setMap(@marker.getMap())

        getSharedCross: (crossUrl)=>
            @markerLabel.getSharedCross(crossUrl)
        setTitle: ()=>
            @markerLabel.setTitle()
        setContent: ()=>
            @markerLabel.setContent()
        setStyles: ()=>
            @markerLabel.setStyles()
        setMandatoryStyles: ()=>
            @markerLabel.setMandatoryStyles()
        setAnchor: ()=>
            @markerLabel.setAnchor()
        setVisible: ()=>
            @markerLabel.setVisible()
        setZIndex: ()=>
            @markerLabel.setZIndex()
        setPosition: ()=>
            @markerLabel.setPosition()
        draw: ()=>
            @markerLabel.draw()
        destroy: ()=>
            #bug in MarkerLabel_ so we will check it here and maybe submit a patch
            @markerLabel.onRemove() if @markerLabel.labelDiv_.parentNode? and @markerLabel.eventDiv_.parentNode?
    MarkerLabelChildModel
]