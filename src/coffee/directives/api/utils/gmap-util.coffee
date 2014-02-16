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
            Logger.info "content not defined" unless content
            Logger.info "defaults not defined" unless defaults


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
]
