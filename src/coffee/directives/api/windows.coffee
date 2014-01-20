###
	Windows directive where many windows map to the models property
###
@ngGmapModule "directives.api", ->
    class @Windows extends directives.api.IWindow
        constructor: ($timeout, $compile, $http, $templateCache, $interpolate) ->
            super($timeout, $compile, $http, $templateCache)
            self = @
            @$interpolate = $interpolate
            @require = ['^googleMap', '^?markers']
            @template = '<span class="angular-google-maps-windows" ng-transclude></span>'
            @scope.models = '=models' #if undefined it will try get a markers models
            @scope.doRebuildAll = '=dorebuildall' #root level directive attribute not a model level
            @scope.id = '=id' #id key to bind to that makes a model unique, if it does not exist default to rebuilding all markers
            @$log.info(self)

        link: (scope, element, attrs, ctrls) =>
            new directives.api.models.parent.WindowsParentModel(scope, element, attrs, ctrls, @$timeout,
                    @$compile, @$http, @$templateCache, @$interpolate)