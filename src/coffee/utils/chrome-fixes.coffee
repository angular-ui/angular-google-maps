angular.module("google-maps.directives.api.utils".ns())
  .factory "ChromeFixes".ns(), [->
    maybeRepaint: (el) ->
      if el
        od = el.style.display
        el.style.display = 'none'
        _.defer ->
          el.style.display = od

  ]
