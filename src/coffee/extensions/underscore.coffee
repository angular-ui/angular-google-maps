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
