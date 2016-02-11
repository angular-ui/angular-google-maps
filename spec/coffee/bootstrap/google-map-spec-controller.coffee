do ->
  module = angular.module("angular-google-maps-specs", ['uiGmapgoogle-maps'])
    .controller 'GoogleMapSpecController', ($scope, $timeout, $log) ->
      self = @
      @hasRun = false
      @map = {}
      google.maps.visualRefresh = true
      angular.extend $scope,
        showTraffic: true,
        center:
          latitude: 45
          longitude: -73
        zoom: 3,
        events: #direct hook to google maps sdk events
          tilesloaded: (map, eventName, originalEventArgs) ->
            if !self.hasRun
              self.map = map
              document.gMap = map
              self.hasRun = true
