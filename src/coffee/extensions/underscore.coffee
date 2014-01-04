###
    Author Nick McCready
    Intersection of Objects if the arrays have something in common each intersecting object will be returned
    in an new array.
###
_.intersectionObjects = (array1,array2,comparison = undefined) ->
    res = _.map array1, (obj1) =>
        _.find array2, (obj2) =>
            if comparison?
                comparison(obj1,obj2)
            else
                _.isEqual(obj1,obj2)
    _.filter res,(o) ->
        o?