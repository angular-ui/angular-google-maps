# The service, that is a promise for a reference to window.google.maps
angular.module('google-maps.providers'.ns())
.factory('MapScriptLoader'.ns(), ['$q', 'uuid'.ns(), ($q, uuid) ->
      scriptId = undefined

      getScriptUrl = (options)->
        if options.china
          return 'http://maps.google.cn/maps/api/js?'
        else
          return 'https://maps.googleapis.com/maps/api/js?'

      load: (options)->
        deferred = $q.defer()
        # Early-resolve if google-maps-api is already in global-scope
        if angular.isDefined(window.google) and angular.isDefined(window.google.maps)
          deferred.resolve window.google.maps
          return deferred.promise

        randomizedFunctionName = options.callback = 'onGoogleMapsReady' + Math.round(Math.random() * 1000)
        window[randomizedFunctionName] = ->
          window[randomizedFunctionName] = null
          # Resolve the promise
          deferred.resolve window.google.maps
          return

        query = _.map options, (v, k) ->
          k + '=' + v

        if scriptId
          document.getElementById(scriptId).remove()
        query = query.join '&'
        script = document.createElement 'script'
        scriptId = "ui_gmap_map_load_" + uuid.generate()
        script.id = scriptId
        script.type = 'text/javascript'
        script.src = getScriptUrl(options) + query
        document.body.appendChild script

        # Return the promise
        deferred.promise
])
#holy hool!!, any time your passing a dependency to a 'provider' you must append the Provider text to the service
# name.. makes no sense and this is not documented well
.provider('GoogleMapApi'.ns(), ->
    # Some nice default options
    @options =
    #    key: 'api-key here',
      china: false
      v: '3.17'
      libraries: ''
      language: 'en'
      sensor: 'false'

    # A function that lets us configure options of the service
    @configure = (options) ->
      angular.extend @options, options
      return

    # Return an instance of the service
    @$get = ['MapScriptLoader'.ns() ,(loader) =>
      loader.load @options
    ]
    @
  )
