###
    Simple Object Map with a lenght property to make it easy to track length/size
###
angular.module("google-maps.directives.api.utils")
.factory "PropMap",  ->
    propsToPop = ['get', 'put', 'remove', 'values', 'keys', 'length']
    class PropMap
        constructor: () ->
            @length = 0
        get: (key)=>
            @[key]
        #modify map through put or remove to keep track of length , otherwise the state will be incorrect
        put: (key, value)=>
            unless @[key]? #if we are adding something new increment length
                @length++
            @[key] = value
        remove: (key)=>
            delete @[key]
            @length--

        values: ()=>
            all = []
            keys = _.keys @
            _.each keys, (value) =>
               all.push(@[value]) if _.indexOf(propsToPop, value) == -1
            all
        keys: ()=>
            keys = _.keys @
            all = []
            _.each keys, (prop)=>
                all.push(prop) if _.indexOf(propsToPop, prop) == -1
            all
    PropMap