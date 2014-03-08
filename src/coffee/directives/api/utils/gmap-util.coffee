angular.module("google-maps.directives.api.utils")
.service "GmapUtil",["Logger", "$compile", (Logger, $compile) ->
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

    createWindowOptions: (gMarker, scope, content, defaults, contentIsParsed = false) ->
        if content? and defaults? and $compile?
            angular.extend {}, defaults,
                content: @buildContent(scope,defaults,content,contentIsParsed),
                position: if defaults.position?
                then defaults.position else if angular.isObject(gMarker)
                then gMarker.getPosition() else new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude)
        else
            unless defaults
                Logger.error "infoWindow defaults not defined"
                Logger.error "infoWindow content not defined" unless content
            else
                return defaults

    buildContent:(scope,defaults,content,contentIsParsed) ->
        if defaults.content?
            ret = defaults.content
        else
            if $compile? and !contentIsParsed
                parsed =$compile(content)(scope)
                if parsed.length > 0
                    ret = parsed[0] #must be one element with children or angular bindings get lost
            else
                ret = content
        ret

    defaultDelay: 50

    isTrue:(val) ->
        angular.isDefined(val) and val isnt null and val is true or val is "1" or val is "y" or val is "true"

    getCoords: (value) ->
        new google.maps.LatLng(value.latitude, value.longitude)

    validatePathPoints: (path) ->
        i = 0
        while i < path.length
            return false  if angular.isUndefined(path[i].latitude) or angular.isUndefined(path[i].longitude)
            i++
        true

    convertPathPoints: (path) ->
        result = new google.maps.MVCArray()
        i = 0

        while i < path.length
            result.push new google.maps.LatLng(path[i].latitude, path[i].longitude)
            i++
        result

    extendMapBounds:(map, points) ->
        bounds = new google.maps.LatLngBounds()
        i = 0

        while i < points.length
            bounds.extend points.getAt(i)
            i++
        map.fitBounds bounds
]
