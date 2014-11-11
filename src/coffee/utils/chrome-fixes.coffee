angular.module("uiGmapgoogle-maps.directives.api.utils")
  .factory "uiGmapChromeFixes", [->
    maybeRepaint: (el) ->
      if el
        od = el.style.display
        el.style.display = 'none'
        _.defer ->
          el.style.display = od

  ]
