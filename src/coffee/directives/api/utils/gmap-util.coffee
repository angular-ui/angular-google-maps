@ngGmapModule "directives.api.utils", ->
    @GmapUtil =
        getLabelPositionPoint: (anchor) ->
            if anchor == undefined
                return undefined

            anchor = /^([\d\.]+)\s([\d\.]+)$/.exec(anchor)
            xPos = anchor[1]
            yPos = anchor[2]
            if xPos && yPos
                new google.maps.Point(xPos, yPos)

        createMarkerOptions: (coords, icon, defaults, map = undefined) ->
            defaults = {} unless defaults?
            opts = angular.extend {}, defaults,
                position: if defaults.position? then defaults.position
                else new google.maps.LatLng(coords.latitude, coords.longitude),
                icon: if defaults.icon? then defaults.icon else icon,
                visible: if defaults.visible? then defaults.visible else coords.latitude? and coords.longitude?
            opts.map = map if map?
            opts

        createWindowOptions: (gMarker, scope, content, defaults) ->
            if content? and defaults?
                angular.extend {}, defaults,
                    content: if defaults.content?
                    then defaults.content else content,
                    position: if defaults.position?
                    then defaults.position else if angular.isObject(gMarker)
                    then gMarker.getPosition() else new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude)
            else
                unless defaults
#                    Logger.error "infoWindow defaults not defined"
#                    Logger.error "infoWindow content not defined" unless content
                else
                    return defaults

        defaultDelay: 50
