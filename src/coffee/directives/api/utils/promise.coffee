# wrapper to be 'like' bluebirds interface
angular.module('uiGmapgoogle-maps.directives.api.utils')
.service 'uiGmapPromise', [ '$q', '$timeout', 'uiGmapLogger', ($q, $timeout, $log) ->

  promiseTypes =
    create : 'create'
    update : 'update'
    delete : 'delete'
    init: 'init'

  promiseStatuses =
    IN_PROGRESS: 0
    RESOLVED: 1
    REJECTED: 2

  strPromiseStatuses = do ->
    obj = {}
    obj["#{promiseStatuses.IN_PROGRESS}"] = 'in-progress'
    obj["#{promiseStatuses.RESOLVED}"] = 'resolved'
    obj["#{promiseStatuses.REJECTED}"] = 'rejected'
    obj

  isInProgress = (promise) ->
    return promise.$$state.status == promiseStatuses.IN_PROGRESS if promise.$$state
    true unless promise.hasOwnProperty("$$v")


  isResolved = (promise) ->
    return promise.$$state.status == promiseStatuses.RESOLVED if promise.$$state
    true if promise.hasOwnProperty("$$v")

  promiseStatus = (status) ->
    strPromiseStatuses[status] or 'done w error'

  #wrapper to expose reject (cancel), notify and other extensions on a promise without needing to pass around deferred.
  ExposedPromise = (promise) ->
    cancelDeferred = $q.defer()
    combined = $q.all [promise, cancelDeferred.promise]
    wrapped = $q.defer()

    promise.then cancelDeferred.resolve, (->), (notify)  ->
      cancelDeferred.notify notify
      wrapped.notify notify

    #if we completion from combined then we pass on the correct msh from its index
    combined.then (successes) ->
      wrapped.resolve successes[0] or successes[1]
    , (error) ->
      wrapped.reject error
    #    , (notifies) -> #this is not handled in angular yet.. it should be
    #      wrapped.notify notifies[0] or notifies[1]

    wrapped.promise.cancel = (reason = 'canceled') ->
      cancelDeferred.reject reason

    wrapped.promise.notify = (msg = 'cancel safe') ->
      wrapped.notify msg
      #if originating promise is a cancelable type (we can send it a message as well)
      promise.notify msg if promise.hasOwnProperty('notify')

    if promise.promiseType?
      wrapped.promise.promiseType = promise.promiseType
    wrapped.promise

  # a wrapper on a promise that has not been executed
  # consider passing in a unresolved promise instead of a callback, or handle both
  SniffedPromise = (fnPromise, promiseType) ->
    promise: fnPromise
    promiseType: promiseType

  #export
  defer = ->
    $q.defer()
  resolve =  ->
    d = $q.defer()
    d.resolve.apply(undefined,arguments)
    d.promise

  #create a promise around a callback that has not executed
  promise= (fnToWrap) ->
    unless _.isFunction fnToWrap
      $log.error "uiGmapPromise.promise() only accepts functions"
      return
    d = $q.defer()
    $timeout ->
      result = fnToWrap()
      d.resolve result
    d.promise

  defer: defer
  promise: promise
  resolve: resolve
  promiseTypes: promiseTypes
  isInProgress: isInProgress
  isResolved: isResolved
  promiseStatus: promiseStatus
  ExposedPromise: ExposedPromise
  SniffedPromise: SniffedPromise
]