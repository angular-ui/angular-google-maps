angular.module("google-maps.directives.api.models.child")
.factory "MarkerLabelChildModel", [ "BaseObject", "GmapUtil", (BaseObject, GmapUtil) ->
    class MarkerLabelChildModel extends BaseObject
        @include GmapUtil
        constructor: (gMarker, opt_options) ->
            super()
            self = @

            @gMarker = gMarker
            @gMarker.set("labelContent", opt_options.labelContent)
            @gMarker.set("labelAnchor", @getLabelPositionPoint(opt_options.labelAnchor))
            @gMarker.set("labelClass", opt_options.labelClass || 'labels')
            @gMarker.set("labelStyle", opt_options.labelStyle || { opacity: 100 })
            @gMarker.set("labelInBackground", opt_options.labelInBackground || false;)

            if !opt_options.labelVisible
                @gMarker.set("labelVisible", true)

            if !opt_options.raiseOnDrag
                @gMarker.set("raiseOnDrag", true)

            if !opt_options.clickable
                @gMarker.set("clickable", true)

            if !opt_options.draggable
                @gMarker.set("draggable", false)

            if !opt_options.optimized
                @gMarker.set("optimized", false)

            #TODO: This should be overrideable and only gets set as a default if nothing is defined
            opt_options.crossImage = opt_options.crossImage ? document.location.protocol + "//maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png";
            opt_options.handCursor = opt_options.handCursor ? document.location.protocol + "//maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur";

            @gMarkerLabel = new MarkerLabel_(@gMarker, opt_options.crossImage, opt_options.handCursor)

            @gMarker.set("setMap", (theMap)->
                google.maps.Marker.prototype.setMap.apply(this, arguments);
                self.gMarkerLabel.setMap(theMap)
            )

            @gMarker.setMap(@gMarker.getMap())

        getSharedCross: (crossUrl)=>
            @gMarkerLabel.getSharedCross(crossUrl)
        setTitle: ()=>
            @gMarkerLabel.setTitle()
        setContent: ()=>
            @gMarkerLabel.setContent()
        setStyles: ()=>
            @gMarkerLabel.setStyles()
        setMandatoryStyles: ()=>
            @gMarkerLabel.setMandatoryStyles()
        setAnchor: ()=>
            @gMarkerLabel.setAnchor()
        setVisible: ()=>
            @gMarkerLabel.setVisible()
        setZIndex: ()=>
            @gMarkerLabel.setZIndex()
        setPosition: ()=>
            @gMarkerLabel.setPosition()
        draw: ()=>
            @gMarkerLabel.draw()
        destroy: ()=>
            #bug in MarkerLabel_ so we will check it here and maybe submit a patch
            @gMarkerLabel.onRemove() if @gMarkerLabel.labelDiv_.parentNode? and @gMarkerLabel.eventDiv_.parentNode?
    MarkerLabelChildModel
]