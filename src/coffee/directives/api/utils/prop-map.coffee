###
    Simple Object Map with a lenght property to make it easy to track length/size
###
angular.module("google-maps.api.utils")
.factory "PropMap",  ->
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
            propsToPop = ['get', 'put', 'remove', 'values', 'keys', 'length']
            all = _.values @
            _.each propsToPop, (prop)=>
                all.pop()
            all
        keys: ()=>
            all = _.keys @
            _.each propsToPop, (prop)=>
                all.pop()
            all
    PropMap