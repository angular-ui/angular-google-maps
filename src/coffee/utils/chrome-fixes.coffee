angular.module("uiGmapgoogle-maps.directives.api.utils")
  .factory "uiGmapChromeFixes", ['$timeout', ($timeout) ->
    maybeRepaint: (el) ->
      if el
        el.style.opacity = 0.9
        $timeout ->
          el.style.opacity = 1
  ]
