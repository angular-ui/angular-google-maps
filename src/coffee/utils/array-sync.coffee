angular.module('uiGmapgoogle-maps').factory 'uiGmaparray-sync', [
  'uiGmapadd-events', (mapEvents) ->
  # pathChangedFn is an optional callback that is called whenever a change to the path
  #  is detected.  The first parameter contains the internal array of Google LatLng objects.
    (mapArray, scope, pathEval, pathChangedFn) ->
      isSetFromScope = false
      scopePath = scope.$eval(pathEval)
      if !scope.static
        #should pathChangedFn be called for changes made via the UI too?  Currently not needed, and not implemented
        legacyHandlers =
        #listeners / handles to changes of the points from the map direction to update back to our scope (two way)
          set_at: (index) ->
            return if isSetFromScope #important to avoid cyclic forever change loop watch to map event change and back
            value = mapArray.getAt(index)
            return  unless value
            if not value.lng or not value.lat # LatLng object
              scopePath[index] = value
            else
              scopePath[index].latitude = value.lat()
              scopePath[index].longitude = value.lng()

          insert_at: (index) ->
            return if isSetFromScope #important to avoid cyclic forever change loop watch to map event change and back
            value = mapArray.getAt(index)
            return  unless value
            #check to make sure we are not inserting something that is already there
            if not value.lng or not value.lat # LatLng object
              scopePath.splice index, 0, value
            else
              scopePath.splice index, 0,
                latitude: value.lat()
                longitude: value.lng()

          remove_at: (index) ->
            return if isSetFromScope #important to avoid cyclic forever change loop watch to map event change and back
            scopePath.splice index, 1

        geojsonArray
        if scopePath.type == 'Polygon'
          #Note: we only support display of the outer Polygon ring, not internal holes
          geojsonArray = scopePath.coordinates[0]
        else if scopePath.type == 'LineString'
          geojsonArray = scopePath.coordinates

        geojsonHandlers =
          set_at: (index) ->
            return if isSetFromScope #important to avoid cyclic forever change loop watch to map event change and back
            value = mapArray.getAt(index)
            return  unless value
            return  if not value.lng or not value.lat
            geojsonArray[index][1] = value.lat()
            geojsonArray[index][0] = value.lng()

          insert_at: (index) ->
            return if isSetFromScope #important to avoid cyclic forever change loop watch to map event change and back
            value = mapArray.getAt(index)
            return  unless value
            return  if not value.lng or not value.lat
            geojsonArray.splice index, 0, [ value.lng(), value.lat() ]

          remove_at: (index) ->
            return if isSetFromScope #important to avoid cyclic forever change loop watch to map event change and back
            geojsonArray.splice index, 1

        mapArrayListener = mapEvents mapArray,
          if angular.isUndefined scopePath.type then legacyHandlers else geojsonHandlers

      legacyWatcher = (newPath) ->
        isSetFromScope = true
        oldArray = mapArray
        changed = false
        if newPath
          i = 0
          oldLength = oldArray.getLength()
          newLength = newPath.length
          l = Math.min(oldLength, newLength)
          newValue = undefined
          #update existing points if different
          while i < l
            oldValue = oldArray.getAt(i)
            newValue = newPath[i]
            if typeof newValue.equals == 'function' #LatLng object
              if not newValue.equals(oldValue)
                oldArray.setAt i, newValue
                changed = true
            else # latitude/longitude object
              if (oldValue.lat() isnt newValue.latitude) or (oldValue.lng() isnt newValue.longitude)
                oldArray.setAt i, new google.maps.LatLng(newValue.latitude, newValue.longitude)
                changed = true

            i++
          #add new points
          while i < newLength
            newValue = newPath[i]
            if typeof newValue.lat == 'function' and typeof newValue.lng == 'function'
              oldArray.push newValue
            else
              oldArray.push new google.maps.LatLng(newValue.latitude, newValue.longitude)

            changed = true
            i++
          #remove old no longer there
          while i < oldLength
            oldArray.pop()
            changed = true
            i++

        isSetFromScope = false
        pathChangedFn oldArray if changed

      geojsonWatcher = (newPath) ->
        isSetFromScope = true
        oldArray = mapArray
        changed = false
        if newPath
          array
          if scopePath.type == 'Polygon'
            array = newPath.coordinates[0]
          else if scopePath.type == 'LineString'
            array = newPath.coordinates

          i = 0
          oldLength = oldArray.getLength()
          newLength = array.length
          l = Math.min(oldLength, newLength)
          newValue = undefined
          while i < l
            oldValue = oldArray.getAt(i)
            newValue = array[i]
            if (oldValue.lat() isnt newValue[1]) or (oldValue.lng() isnt newValue[0])
              oldArray.setAt i, new google.maps.LatLng(newValue[1], newValue[0])
              changed = true

            i++
          while i < newLength
            newValue = array[i]
            oldArray.push new google.maps.LatLng(newValue[1], newValue[0])
            changed = true
            i++
          while i < oldLength
            oldArray.pop()
            changed = true
            i++

        isSetFromScope = false
        pathChangedFn oldArray if changed

      watchListener
      if !scope.static
        if angular.isUndefined(scopePath.type)
          watchListener = scope.$watchCollection pathEval, legacyWatcher
        else
          watchListener = scope.$watch pathEval, geojsonWatcher, true

      ->
        if mapArrayListener
          mapArrayListener()
          mapArrayListener = null
        if watchListener
          watchListener() # call the watch deregistration function
          watchListener = null
]
