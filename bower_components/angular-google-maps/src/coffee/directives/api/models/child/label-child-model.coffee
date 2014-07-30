angular.module("google-maps.directives.api.models.child")
.factory "MarkerLabelChildModel", [ "BaseObject", "GmapUtil", (BaseObject, GmapUtil) ->
    class MarkerLabelChildModel extends BaseObject
        @include GmapUtil
        constructor: (gMarker, options, map) ->
            super()
            self = @
            @gMarker = gMarker
            @setOptions options
            @gMarkerLabel = new MarkerLabel_(@gMarker, options.crossImage, options.handCursor)

            @gMarker.set "setMap", (theMap) ->
                self.gMarkerLabel.setMap theMap
                google.maps.Marker.prototype.setMap.apply @, arguments

            @gMarker.setMap map
            
        setOption:(optStr,content) ->
          ###
             COMENTED CODE SHOWS AWFUL CHROME BUG in Google Maps SDK 3, still happens in version 3.16
            any animation will cause markers to disappear
          ###
#          oldAnim = @gMarker.getAnimation()
#          @gMarker.setAnimation null
          @gMarker.set optStr, content
#          _.delay =>
#            @gMarker.setAnimation oldAnim
#          , 1000

        setOptions:(options) =>
            @gMarker.set("labelContent", options.labelContent) if options?.labelContent
            @gMarker.set("labelAnchor", @getLabelPositionPoint(options.labelAnchor)) if options?.labelAnchor
            @gMarker.set("labelClass", options.labelClass || 'labels')
            @gMarker.set("labelStyle", options.labelStyle || { opacity: 100 })
            @gMarker.set("labelInBackground", options.labelInBackground || false;)

            if !options.labelVisible
              @gMarker.set("labelVisible", true)

            if !options.raiseOnDrag
              @gMarker.set("raiseOnDrag", true)

            if !options.clickable
              @gMarker.set("clickable", true)

            if !options.draggable
              @gMarker.set("draggable", false)

            if !options.optimized
              @gMarker.set("optimized", false)

            #TODO: This should be overrideable and only gets set as a default if nothing is defined
            options.crossImage = options.crossImage ? document.location.protocol + "//maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png";
            options.handCursor = options.handCursor ? document.location.protocol + "//maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur";

        destroy: ()=>
            #bug in MarkerLabel_ so we will check it here and maybe submit a patch
            @gMarkerLabel.onRemove() if @gMarkerLabel.labelDiv_.parentNode? and @gMarkerLabel.eventDiv_.parentNode?

    MarkerLabelChildModel
]