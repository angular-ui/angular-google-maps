describe 'uiGmapLogger', ->
  beforeEach ->
    angular.mock.module('uiGmapgoogle-maps.directives.api.utils')
    inject ['$rootScope', 'uiGmapLogger', ($rootScope, $log) =>
      @scope = $rootScope.$new()
      @subject = $log
      @createSpyLogger = ->
        @info = ->
        @debug = ->
        @warn = ->
        @error = ->

        spyOn(@, 'info')
        spyOn(@, 'debug')
        spyOn(@, 'warn')
        spyOn(@, 'error')
        @

      @log = @createSpyLogger()
      $log.setLog @log
    ]

  describe 'default', ->
    it 'error logging works', ->
      @subject.error('blah')
      expect(@log.error).toHaveBeenCalled()

    it 'debug', ->
      @subject.debug('blah')
      expect(@log.debug).not.toHaveBeenCalled()

    it 'info', ->
      @subject.info('blah')
      expect(@log.info).not.toHaveBeenCalled()

    it 'warn', ->
      @subject.warn('blah')
      expect(@log.warn).not.toHaveBeenCalled()

  describe 'spawn', ->
    beforeEach ->
      @newLogger = @subject.spawn()
      @newLog = @createSpyLogger()

    it 'can create a new logger', ->
      expect(@newLogger.debug).toBeDefined()
      expect(@newLogger != @subject).toBeTruthy()

    describe 'Has Independent', ->
      it 'logLevels', ->
        @newLogger.currentLevel = @newLogger.LEVELS.debug
        expect(@newLogger.currentLevel != @subject.currentLevel).toBeTruthy()
        @newLogger.debug('blah')
        expect(@log.debug).toHaveBeenCalled()
        @newLogger.setLog(@newLog)
        @newLogger.debug('blah')
        @subject.debug('blah')
        expect(@newLog.debug).toHaveBeenCalled()

