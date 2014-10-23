defaultMap =
  zoom: 12
  center:
    longitude: 47
    latitude: -27

window["Initiator".ns()] =
  initDirective: (toInit, apiSubjectClassName, thingsToInit = ['initAll'], map = defaultMap)->

    injects = ['$compile', '$rootScope', '$timeout', 'Logger'.ns()]
    if apiSubjectClassName?
      injects.push apiSubjectClassName.ns()

    module "google-maps.mocks".ns()

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
    app = module "google-maps.mocks".ns()
    module "google-maps.directives.api.utils".ns()
    apiMock = undefined
    inject ['GoogleApiMock',(GoogleApiMock) =>
      apiMock = new GoogleApiMock()
      apiMock.initAll()
    ]
    app: app
    apiMock: apiMock
