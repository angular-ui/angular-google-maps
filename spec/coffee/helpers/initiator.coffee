defaultMap =
  zoom: 12
  center:
    longitude: 47
    latitude: -27

window["uiGmapInitiator"] =
  initDirective: (toInit, apiSubjectClassName, thingsToInit = ['initAll'], map = defaultMap)->

    injects = ['$compile', '$rootScope', '$timeout', 'uiGmapLogger']
    if apiSubjectClassName?
      injects.push 'uiGmap' + apiSubjectClassName

    module "uiGmapgoogle-maps.mocks"

    inject (GoogleApiMock) ->
      toInit.apiMock = new GoogleApiMock()
      thingsToInit.forEach (init) ->
        toInit.apiMock[init]()

    injects.push ($compile, $rootScope, $timeout, Logger, SubjectClass) ->
      toInit.compile = $compile
      toInit.rootScope = $rootScope
      toInit.subject = new SubjectClass() if SubjectClass?
      toInit.log = Logger

      # mock map scope
      toInit.scope = toInit.rootScope.$new()
      toInit.scope.map = map

    inject injects

    spyOn toInit.log, 'error'
    toInit

  initMock: ->
    app = module "uiGmapgoogle-maps.mocks"
    module "uiGmapgoogle-maps.directives.api.utils"
    apiMock = undefined
    inject ['GoogleApiMock',(GoogleApiMock) =>
      apiMock = new GoogleApiMock()
      apiMock.initAll()
    ]
    app: app
    apiMock: apiMock
