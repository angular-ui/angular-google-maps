angular.module("google-maps")
.factory "array-sync", ["add-events", (mapEvents) ->
    LatLngArraySync = (mapArray, scope, pathEval) ->
        scopeArray = scope.$eval(pathEval)
        mapArrayListener = mapEvents(mapArray,
            set_at: (index) ->
                value = mapArray.getAt(index)
                return  unless value
                return  if not value.lng or not value.lat
                scopeArray[index].latitude = value.lat()
                scopeArray[index].longitude = value.lng()

            insert_at: (index) ->
                value = mapArray.getAt(index)
                return  unless value
                return  if not value.lng or not value.lat
                scopeArray.splice index, 0,
                    latitude: value.lat()
                    longitude: value.lng()


            remove_at: (index) ->
                scopeArray.splice index, 1
        )
        watchListener = scope.$watch(pathEval, (newArray) ->
            oldArray = mapArray
            if newArray
                i = 0
                oldLength = oldArray.getLength()
                newLength = newArray.length
                l = Math.min(oldLength, newLength)
                newValue = undefined
                while i < l
                    oldValue = oldArray.getAt(i)
                    newValue = newArray[i]
                    oldArray.setAt i, new google.maps.LatLng(newValue.latitude, newValue.longitude)  if (oldValue.lat() isnt newValue.latitude) or (oldValue.lng() isnt newValue.longitude)
                    i++
                while i < newLength
                    newValue = newArray[i]
                    oldArray.push new google.maps.LatLng(newValue.latitude, newValue.longitude)
                    i++
                while i < oldLength
                    oldArray.pop()
                    i++
        , true)
        ->
            if mapArrayListener
                mapArrayListener()
                mapArrayListener = null
            if watchListener
                watchListener()
                watchListener = null
]