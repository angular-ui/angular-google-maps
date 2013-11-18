@ngGmapModule "directives.api.utils", ->
    @GmapUtil =
        getLabelPositionPoint: (anchor) ->
            anchor = /^([\d\.]+)\s([\d\.]+)$/.exec(anchor)
            xPos = anchor[1]
            yPos = anchor[2]
            if xPos && yPos
                new google.maps.Point(xPos, yPos)

        createMarkerOptions: (coords, icon, defaults, map = undefined) ->
            opts = angular.extend({}, defaults, {
                position: new google.maps.LatLng(coords.latitude, coords.longitude),
                icon: icon,
                visible: coords.latitude? and coords.longitude?
            })
            opts.map = map if map?
            opts

        createWindowOptions: (gMarker, scope, content, defaults) ->
            if content? and defaults?
                angular.extend({}, defaults,
                    content: content,
                    position:
                        if angular.isObject(gMarker)
                            gMarker.getPosition()
                        else
                            new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude)
                )

        defaultDelay: 50
