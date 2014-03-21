angular.module("google-maps.directives.api.utils")
.service "GmapUtil",["Logger", "$compile", (Logger, $compile) ->
    getCoords = (value) ->
        if Array.isArray(value) and value.length is 2
            new google.maps.LatLng(value[1], value[0])
        else if angular.isDefined(value.type) and value.type is "Point"
            new google.maps.LatLng(value.coordinates[1], value.coordinates[0])
        else
            new google.maps.LatLng(value.latitude, value.longitude)

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
            else getCoords(coords),
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
                then gMarker.getPosition() else getCoords(scope.coords)
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

    isFalse: (value) ->
        ['false', 'FALSE', 0, 'n', 'N', 'no', 'NO'].indexOf(value) != -1

    getCoords: getCoords

    validateCoords: (coords) ->
        return false if angular.isUndefined(coords)
        
        if Array.isArray(coords)
            return true if coords.length is 2
        else if angular.isDefined(coords.type)
            return true if coords.type is "Point" and Array.isArray(coords.coordinates) and coords.coordinates.length is 2
        else
            return true if angular.isDefined(coords.latitude) and angular.isDefined(coords.longitude)
            
        false
        
    validatePath: (path) ->
        i = 0
        if angular.isUndefined(path.type)
            return false if path.length < 2
            while i < path.length
                return false if angular.isUndefined(path[i].latitude) or angular.isUndefined(path[i].longitude)
                i++
                
            true
        else
            return false if angular.isUndefined(path.coordinates)
            
            array
            if path.type is "Polygon"
                return false if path.coordinates[0].length < 4
                #Note: At this time, we only support the outer polygon and ignore the inner 'holes'
                array = path.coordinates[0]
            else if path.type is "LineString"
                return false if path.coordinates.length < 2
                array = path.coordinates
            else
                return false
              
            while i < array.length
                return false if array[i].length != 2
                i++
                
            true

    convertPathPoints: (path) ->
        result = new google.maps.MVCArray()
        
        i = 0
        if angular.isUndefined(path.type)
            while i < path.length
                result.push new google.maps.LatLng(path[i].latitude, path[i].longitude)
                i++
        else
            array
            if path.type is "Polygon"
                #Note: At this time, we only support the outer polygon and ignore the inner 'holes'
                array = path.coordinates[0]
            else if path.type is "LineString"
                array = path.coordinates
                
            while i < array.length
                result.push new google.maps.LatLng(array[i][1], array[i][0])
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
