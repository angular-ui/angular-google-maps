window.uiGmapInitiator =
  initDirective: (testSuite, apiSubjectClassName, thingsToInit = ['initAll']) ->

    injects = ['uiGmapLogger']
    if apiSubjectClassName?
      injects.push 'uiGmap' + apiSubjectClassName

    module "uiGmapgoogle-maps.mocks"

    inject (GoogleApiMock) ->
      testSuite.apiMock = new GoogleApiMock()
      thingsToInit.forEach (init) ->
        testSuite.apiMock[init]()

    injects.push (Logger, SubjectClass) ->
      testSuite.subject = new SubjectClass() if SubjectClass?
      testSuite.log = Logger

      spyOn testSuite.log, 'error'

    testSuite.injects.push injects

    testSuite

  initMock: (testSuite, injectedCb) ->
    app = window.module "uiGmapgoogle-maps.mocks"
    window.module "uiGmapgoogle-maps.directives.api.utils"
    apiMock = undefined
    testSuite.injects.push (GoogleApiMock) ->
      apiMock = new GoogleApiMock()
      apiMock.initAll()
      injectedCb(apiMock) if injectedCb? and _.isFunction injectedCb

    app: app
    apiMock: apiMock
