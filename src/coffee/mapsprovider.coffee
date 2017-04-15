###

Google Maps Service Provider & API.

    It gives us a better way to call a custom maps api js from google, with .config parameters in the application.
    If no config is made, we're calling the default map.

    All the other directives will wait for this service provider to put the map on page.

@authors
Kovacs Arthur - http://github.com/ArthurianX/
###
(->
    app = angular.module("google-maps", [])
    app.provider "googleMaps", [() ->

        #assigning empty vars.
        useSensor = false
        apiKey = null
        useLanguage = null
        useLibrary = null
        useVersion = null

        #I'm adding all the configs to this object, I hope this is alright, then pass it inside the constructor function.
        options = {}

        # Public Config API's
        @useSensor = (sensor) ->
            if sensor
                options.sensor = sensor
                return this
            useSensor

        @apiKey = (key) ->
            if key
                options.key = key
                return this
            apiKey


        @useLanguage = (language) ->
            if language
                options.language = language
                return this
            useLanguage

        @useLibrary = (libraries) ->
            if libraries
                options.libraries = libraries
                return this
            useLibrary

        @useVersion = (v) ->
            if v
                options.v = v
                return this
            useVersion

        # Private Constructor
        GoogleMapsService = ($q, $window) ->
            makeMap = ->

                #Default map url.
                url = "https://maps.googleapis.com/maps/api/js?"
                concatURL = ->
                    angular.forEach options, (value, key) ->
                        url += ("&" + key + "=" + value)

                if options and ("sensor" of options)
                    #Check to see if we have a sensor value, maybe the user forgot ... stranger things have happened.
                    concatURL()
                else if options

                    #If there is no sensor value, add a default false one.
                    options.sensor = false
                    concatURL()
                else

                    #if no config options
                    url += "?sensor=false&v=3.14"
                url

            @runMap = ->
                deferred = $q.defer()
                randomizedFunctionName = "onGoogleMapsReady" + Math.round(Math.random() * 1000)
                window[randomizedFunctionName] = ->
                    window[randomizedFunctionName] = null

                    # Resolve the promise for googleMaps
                    deferred.resolve $window.google.maps

                if typeof $window.google isnt "undefined" and typeof $window.google.maps isnt "undefined"

                    # Early-resolve the promise for googleMaps
                    deferred.resolve $window.google.maps
                    return deferred.promise

                script = document.createElement("script")
                script.type = "text/javascript"

                script.src = makeMap() + "&callback=" + randomizedFunctionName
                document.body.appendChild script

                # Return a promise for googleMaps
                deferred.promise
            # doing a return here so that the Js compiled doesn't look like return this.runMap - which throws an error.
            return

        #Provider instantiator
        @$get = ($q, $window) ->
            new GoogleMapsService($q, $window)
        # doing a return here so that the Js compiled doesn't look like return this.$get - which throws an error.
        return
    ]

)()