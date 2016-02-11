###globals angular,_,inject###
#global jasmine protects
beforeEach ->
  @googleTemp = window.google

  angular.module('uiGmapgoogle-maps')
  .config ($provide) ->
    $provide.value('$log', console)
    $provide.decorator '$timeout', ($delegate, $browser) ->
      $delegate.hasPendingTasks = ->
        $browser.deferredFns.length > 0

      $delegate

  #create
  angular.module('uiGmapgoogle-maps.specs', ['uiGmapgoogle-maps'])
  #require for testing
  module "uiGmapgoogle-maps.specs"

  @injectAll = =>
    @injects.forEach (toInject) ->
      inject toInject

  @injects = []

  @injects.push (_$rootScope_, $timeout, $q, $browser, $compile, uiGmapPropMap) =>
    window.PropMap = uiGmapPropMap
    @q = $q
    @browser = $browser
    @rootScope = _$rootScope_
    @scope = angular.extend @rootScope.$new(), @scope or {}
    @scope.map = angular.extend @scope.map or {},
      zoom: 12
      center:
        longitude: 47
        latitude: -27

    @timeout = $timeout
    @compile = $compile

  @digest = (fn, doCompile = true) =>
    @compile(@html)(@scope) if @html and @scope and doCompile

    fn() if fn? and _.isFunction fn
    while @timeout.hasPendingTasks()
      @timeout.flush()
    @rootScope.$digest()

afterEach ->
  if @googleTemp?
    window.google = @googleTemp
