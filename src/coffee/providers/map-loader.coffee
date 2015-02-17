# The service, that is a promise for a reference to window.google.maps
angular.module('uiGmapgoogle-maps.providers')
.factory('uiGmapMapScriptLoader', ['$q', 'uiGmapuuid', ($q, uuid) ->
      scriptId = undefined

      getScriptUrl = (options)->
        if options.china
          'http://maps.google.cn/maps/api/js?'
        else
          'https://maps.googleapis.com/maps/api/js?'

      includeScript = (options)->
        query = _.map options, (v, k) ->
          k + '=' + v

        document.getElementById(scriptId).remove() if scriptId
        query = query.join '&'
        script = document.createElement 'script'
        script.id = scriptId = "ui_gmap_map_load_#{uuid.generate()}"
        script.type = 'text/javascript'
        script.src = getScriptUrl(options) + query
        document.body.appendChild script

      isGoogleMapsLoaded = ->
        angular.isDefined(window.google) and angular.isDefined(window.google.maps)

      load: (options)->
        deferred = $q.defer()

        # Early-resolve if google-maps-api is already in global-scope
        if isGoogleMapsLoaded()
          deferred.resolve window.google.maps
          return deferred.promise

        randomizedFunctionName = options.callback = 'onGoogleMapsReady' + Math.round(Math.random() * 1000)
        window[randomizedFunctionName] = ->
          window[randomizedFunctionName] = null
          deferred.resolve window.google.maps
          return

        # Cordova specific https://github.com/apache/cordova-plugin-network-information/
        if window.navigator.connection && window.navigator.connection.type == window.Connection.NONE
          document.addEventListener 'online', ->
            includeScript options if !isGoogleMapsLoaded()
        else
          includeScript options

        # Return the promise
        deferred.promise
])
#holy hool!!, any time your passing a dependency to a 'provider' you must append the Provider text to the service
# name.. makes no sense and this is not documented well
.provider('uiGmapGoogleMapApi', ->
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
    @$get = ['uiGmapMapScriptLoader' ,(loader) =>
      loader.load @options
    ]
    @
  )
