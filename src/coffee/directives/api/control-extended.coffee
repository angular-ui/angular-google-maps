angular.module("uiGmapgoogle-maps.directives.api")
.factory "uiGmapExtendedControl", ["uiGmapIControl", "$http", "$templateCache", "$compile", "$controller",'uiGmapGoogleMapApi',
  (IControl, $http, $templateCache, $compile, $controller, GoogleMapApi) ->
    class Control extends IControl
      constructor: ->
        super()
      transclude:true
      link: (scope, element, attrs, ctrl, transclude) =>
        GoogleMapApi.then (maps) =>

          index = if angular.isDefined scope.index and not isNaN(parseInt scope.index) then parseInt scope.index else undefined

          position = if angular.isDefined scope.position then scope.position.toUpperCase().replace /-/g, '_' else 'TOP_CENTER'
          if not maps.ControlPosition[position]
            @$log.error 'mapControl: invalid position property'
            return

          # Wrap control initialization inside a $timeout() call to make sure the map is created already
          IControl.mapPromise(scope, ctrl).then (map) =>

            control = undefined

            controlDiv = angular.element '<div></div>'

            controlDiv.append transclude()

            if index then controlDiv[0].index = index

            map.controls[google.maps.ControlPosition[position]].push controlDiv[0]

]
