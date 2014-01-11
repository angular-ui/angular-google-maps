###
    Author Nick McCready
    Intersection of Objects if the arrays have something in common each intersecting object will be returned
    in an new array.
###
_.intersectionObjects = (array1, array2, comparison = undefined) ->
    res = _.map array1, (obj1) =>
        _.find array2, (obj2) =>
            if comparison?
                comparison(obj1, obj2)
            else
                _.isEqual(obj1, obj2)
    _.filter res, (o) ->
        o?

# Determine if the array or object contains a given value (using `===`).
#Aliased as `include`.
_.containsObject = _.includeObject = (obj, target, comparison = undefined) ->
    if (obj == null)
        return false
    #    if (nativeIndexOf && obj.indexOf == nativeIndexOf)
    #        return obj.indexOf(target) != -1
    _.any obj, (value) =>
        if comparison?
            comparison value, target
        else
            _.isEqual value, target


_.differenceObjects = (array1, array2, comparison = undefined) ->
    _.filter array1, (value) ->
        !_.containsObject array2, value

#alias to differenceObjects
_.withoutObjects = (array, array2) ->
    _.differenceObjects(array, array2)

_.indexOfObject = (array, item, comparison, isSorted) ->
    return -1  unless array?
    i = 0
    length = array.length
    if isSorted
        if typeof isSorted is "number"
            i = ((if isSorted < 0 then Math.max(0, length + isSorted) else isSorted))
        else
            i = _.sortedIndex(array, item)
            return (if array[i] is item then i else -1)
    while i < length
        if comparison?
            return i if comparison array[i], item
        else
            return i if _.isEqual array[i], item
        i++
    -1

#to easily inherit multiple objects
_.extends=(arrayOfObjectsToCombine)->
    _.reduce arrayOfObjectsToCombine,(combined,toAdd)->
        _.extend(combined,toAdd)
    ,{}#starting point empty object