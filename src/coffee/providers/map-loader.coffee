# The service, that is a promise for a reference to window.google.maps
angular.module('uiGmapgoogle-maps.providers')
.factory('uiGmapMapScriptLoader', ['$q', 'uiGmapuuid', ($q, uuid) ->
      scriptId = undefined
      lastNetworkStatus = undefined

      getScriptUrl = (options)->
        #china doesn't allow https and has a special url
        if options.china
          'http://maps.google.cn/maps/api/js?'
        else
          #auto will just use protocol-less api code so will automatically use https if used on https website, and http if used on http website
          if options.transport == 'auto'
            '//maps.googleapis.com/maps/api/js?';
          else
            options.transport + '://maps.googleapis.com/maps/api/js?';

      includeScript = (options)->
        omitOptions = ['transport', 'isGoogleMapsForWork', 'china']
        # 'Google Maps API for Work developers must not include a key in their requests.' so remove from url params
        if options.isGoogleMapsForWork
          omitOptions.push('key')

        query = _.map _.omit(options, omitOptions), (v, k) ->
          k + '=' + v

        if scriptId
          scriptElem = document.getElementById(scriptId)
          scriptElem.parentNode.removeChild(scriptElem)

        query = query.join '&'
        script = document.createElement 'script'
        script.id = scriptId = "ui_gmap_map_load_#{uuid.generate()}"
        script.type = 'text/javascript'
        script.src = getScriptUrl(options) + query
        document.body.appendChild script


      isGoogleMapsLoaded = ->
        angular.isDefined(window.google) and angular.isDefined(window.google.maps)

      isWebView = (obj = window) ->
        !(!obj.cordova && !obj.PhoneGap && !obj.phonegap && !obj.forge)

      onWindowLoad = (options)->
        if isWebView()
          document.addEventListener 'deviceready', ->
            if window.navigator.connection.type == window.Connection.NONE
              document.addEventListener 'online', ->
                  # Workaround for issue where in Android, network events are fired multiple times in a row
                  # https://issues.apache.org/jira/browse/CB-7787
                  if !lastNetworkStatus || lastNetworkStatus != 'online'
                    lastNetworkStatus = 'online'
                    includeScript options if !isGoogleMapsLoaded()

              document.addEventListener 'offline', ->
                lastNetworkStatus = 'offline'

            else
              includeScript options

        else
          includeScript options

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

        if document.readyState == 'complete'
          onWindowLoad(options)
        else
          window.addEventListener 'load', ->
            window.removeEventListener 'load', onWindowLoad, false
            onWindowLoad(options)

        # Return the promise
        deferred.promise
])
#holy hool!!, any time your passing a dependency to a 'provider' you must append the Provider text to the service
# name.. makes no sense and this is not documented well
.provider('uiGmapGoogleMapApi', ->
    # Some nice default options
    @options =
    #    key: 'api-key here',
    #    client: 'gme-googleMapsForWorkClientId here'
      transport: 'https'
      isGoogleMapsForWork: false
      china: false
      # https://developers.google.com/maps/documentation/javascript/basics#Versioning
      # This should be a release version.
      # If it is not the version you want.. override it or then complain to google.
      v: '3' #NOTICE THIS CAN BE OVERRIDEN, That is why this is a provider!!!!!!!!!
      libraries: ''
      language: 'en'

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
