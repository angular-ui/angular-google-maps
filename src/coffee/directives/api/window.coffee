###
	Window directive for GoogleMap Info Windows, where ng-repeat is being used....
	Where Html DOM element is 1:1 on Scope and a Model
###
@ngGmapModule "directives.api", ->
    class @Window extends directives.api.IWindow
        @include directives.api.utils.GmapUtil
        constructor: ($timeout, $compile, $http, $templateCache) ->
            super($timeout, $compile, $http, $templateCache)
            self = @
            @require = ['^googleMap', '^?marker']
            @template = '<span class="angular-google-maps-window" ng-transclude></span>'
            @$log.info(self)

        link: (scope, element, attrs, ctrls) =>
            @$timeout(=>
                isIconVisibleOnClick = true
                if angular.isDefined(attrs.isiconvisibleonclick)
                    isIconVisibleOnClick = scope.isIconVisibleOnClick
                mapCtrl = ctrls[0].getMap()
                markerCtrl = if ctrls.length > 1 and ctrls[1]? then ctrls[1].getMarkerScope().gMarker else undefined
                defaults = if scope.options? then scope.options else {}
                hasScopeCoords = scope? and scope.coords? and scope.coords.latitude? and scope.coords.longitude?

                opts = if hasScopeCoords then @createWindowOptions(markerCtrl, scope, element.html(), defaults) else defaults

                if mapCtrl? #at the very least we need a Map, the marker is optional as we can create Windows without markers
                    window = new directives.api.models.child.WindowChildModel(
                            scope, opts, isIconVisibleOnClick, mapCtrl,
                            markerCtrl, @$http, @$templateCache, @$compile, element
                    )
                scope.$on "$destroy", =>
                    window.destroy()

                if ctrls[1]?
                    markerScope = ctrls[1].getMarkerScope()
                    markerScope.$watch 'coords', (newValue,oldValue) =>
                        return window.hideWindow() unless newValue?
                    markerScope.$watch 'coords.latitude', (newValue,oldValue) =>
                        if newValue != oldValue
                            window.getLatestPosition()

                @onChildCreation(window) if @onChildCreation? and window?
            , directives.api.utils.GmapUtil.defaultDelay + 25)
            #return child for specs