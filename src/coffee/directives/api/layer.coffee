@ngGmapModule "directives.api", ->
    class @Layer extends oo.BaseObject
        constructor: ($timeout) ->
            @$log = directives.api.utils.Logger
            @$timeout = $timeout
            @restrict = "ECMA"
            @require = "^googleMap"
            @priority = -1
            @transclude = true
            @template = '<span class=\"angular-google-map-layer\" ng-transclude></span>'
            @replace = true
            @scope =
                show: "=show"
                type: "=type"
                namespace: "=namespace"
                options: '=options'

        link: (scope, element, attrs, mapCtrl) =>
            unless attrs.type?
                @$log.info("type attribute for the layer directive is mandatory. Layer creation aborted!!")
                return
            layer = if attrs.namespace == undefined then new google.maps[attrs.type]() else new google.maps[attrs.namespace][attrs.type]()
            gMap = undefined
            doShow = true

            @$timeout ->
                gMap = mapCtrl.getMap()
                doShow = scope.show  if angular.isDefined(attrs.show)
                layer.setMap gMap  if doShow isnt null and doShow and gMap isnt null
                scope.$watch("show", (newValue, oldValue) ->
                    if newValue isnt oldValue
                        doShow = newValue
                        if newValue
                            layer.setMap gMap
                        else
                            layer.setMap null
                , true)

            # remove marker on scope $destroy
            scope.$on "$destroy", ->
                layer.setMap null

