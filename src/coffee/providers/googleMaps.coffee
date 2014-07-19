angular.module("google-maps.providers")
# The service, that is a promise for a reference to window.google.maps
.service('gMapsService', [ '$q', 'options', ($q, options) ->
      deferred = $q.defer()
      # Early-resolve if google-maps-api is already in global-scope
      if _.isDefined(window.google) and _.isDefined(window.google.maps)
        deferred.resolve window.google.maps
        return deferred.promise
      randomizedFunctionName = options.callback = "onGoogleMapsReady" + Math.round(Math.random() * 1000)
      window[randomizedFunctionName] = ->
        window[randomizedFunctionName] = null
        # Resolve the promise
        deferred.resolve window.google.maps
        return

      q = _.map options, (v, k) ->
        k + "=" + v

      q = q.join("&")
      script = document.createElement("script")
      script.type = "text/javascript"
      script.src = "https://maps.googleapis.com/maps/api/js?" + q
      document.body.appendChild script

      # Return the promise
      deferred.promise
    ])
.provider('googleMaps', ['gMapsService', (gMapsService) ->
      # Some nice default options
      @options =

      #    key: 'api-key here',
        v: "3.15"
        libraries: "places"
        language: "en"
        sensor: "false"


      # A function that lets us configure options of the service
      @configure = (options) ->
        angular.extend @options, options
        return


      # Return an instance of the service
      @$get = ["$q", ($q) ->
        return new gMapsService($q, @options)
      ]
    ])