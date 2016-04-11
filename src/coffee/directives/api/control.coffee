angular.module("uiGmapgoogle-maps.directives.api")
.factory "uiGmapControl", ["uiGmapIControl", "$http", "$templateCache", "$compile", "$controller",'uiGmapGoogleMapApi',
  (IControl, $http, $templateCache, $compile, $controller, GoogleMapApi) ->
    class Control extends IControl
      constructor: ->
        super()
      transclude:true,
      link: (scope, element, attrs, ctrl, transclude) =>
        GoogleMapApi.then (maps) =>
          # Validate attributes

          transcludedContent = transclude()

          hasTranscludedContent = transclude().length > 0

          if !hasTranscludedContent && angular.isUndefined scope.template
            @$log.error 'mapControl: could not find a valid template property or elements for transclusion'
            return

          index = if angular.isDefined scope.index and not isNaN(parseInt scope.index) then parseInt scope.index else undefined

          position = if angular.isDefined scope.position then scope.position.toUpperCase().replace /-/g, '_' else 'TOP_CENTER'
          if not maps.ControlPosition[position]
            @$log.error 'mapControl: invalid position property'
            return

          # Wrap control initialization inside a $timeout() call to make sure the map is created already
          IControl.mapPromise(scope, ctrl).then (map) =>
            control = undefined
            controlDiv = angular.element '<div></div>'

            pushControl = (map, control, index) =>

              # add index if defined
              if index then control[0].index = index

              map.controls[google.maps.ControlPosition[position]].push control[0]


            # checking if is using the transcluded content or will load the template
            if hasTranscludedContent

              transclude (transcludeEl) =>

                controlDiv.append transcludeEl

                pushControl(map, controlDiv, index)

            else
              $http.get(scope.template, { cache: $templateCache })
              .success (template) =>
                templateScope = scope.$new()
                controlDiv.append template

                # if a controller is defined on the directive then add it to the template
                if angular.isDefined scope.controller
                  templateCtrl = $controller scope.controller, {$scope: templateScope}
                  controlDiv.children().data '$ngControllerController', templateCtrl

                # use children() rather than content() as the former seems to trim the content
                control = $compile(controlDiv.children())(templateScope)

              .error (error) =>
                @$log.error 'mapControl: template could not be found'
              .then =>
                pushControl(map, control, index)
]
