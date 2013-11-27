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
                onCreated: '&oncreated'

        link: (scope, element, attrs, mapCtrl) =>
            if scope.onCreated?
                new directives.api.models.parent.LayerParentModel(scope, element, attrs, mapCtrl, scope.onCreated,
                        @$timeout)
            else
                new directives.api.models.parent.LayerParentModel(scope, element, attrs, mapCtrl, @$timeout)