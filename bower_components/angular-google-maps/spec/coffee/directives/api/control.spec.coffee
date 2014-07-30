describe "directives.api.control", ->
	beforeEach ->
		module "google-maps.mocks"
		module "google-maps"

		inject (GoogleApiMock) ->
			@apiMock = new GoogleApiMock()
			@apiMock.mockAPI()
			@apiMock.mockMap()
			@apiMock.mockLatLng()
			@apiMock.mockControlPosition()

		inject ($compile, $rootScope, $timeout, Control, Logger) ->
			@compile = $compile
			@rootScope = $rootScope
			@control = new Control()
			@log = Logger

			# mock map scope
			@scope = @rootScope.$new()
			@scope.map = {}
			@scope.map.zoom = 12
			@scope.map.center =
				longitude: 47
				latitude: -27

		inject ($templateCache) ->
			$templateCache.put('mockControl.tpl.html', '<button class="mock">Control</button>')

		spyOn @log, 'error'

	it "can be created", ->
		expect(@control).toBeDefined()

	it "should log error if no template is supplied", ->
		html = angular.element	"""
								<google-map center="map.center" zoom="map.zoom">
									<map-control></map-control>
								</google-map>
								"""
		element = @compile(html)(@scope)
		@rootScope.$apply()
		expect(@log.error).toHaveBeenCalledWith('mapControl: could not find a valid template property')

	it "should load template", ->
		html = angular.element	"""
								<google-map center="map.center" zoom="map.zoom">
									<map-control template="mockControl.tpl.html"></map-control>
								</google-map>
								"""
		element = @compile(html)(@scope)
		@rootScope.$apply()
		expect(@log.error).not.toHaveBeenCalled()
		#TODO: confirm it was added to the map.Controls[position] Array

	it "should validate position attribute", ->
		html = angular.element	"""
								<google-map center="map.center" zoom="map.zoom">
									<map-control template="mockControl.tpl.html" position="bad-position"></map-control>
								</google-map>
								"""
		element = @compile(html)(@scope)
		@rootScope.$apply()
		expect(@log.error).toHaveBeenCalledWith('mapControl: invalid position property')

		@log.error.calls.reset()
		html = angular.element	"""
								<google-map center="map.center" zoom="map.zoom">
									<map-control template="mockControl.tpl.html" position="bottom-center"></map-control>
								</google-map>
								"""
		element = @compile(html)(@scope)
		@rootScope.$apply()
		expect(@log.error).not.toHaveBeenCalled()

		@log.error.calls.reset()
		html = angular.element	"""
								<google-map center="map.center" zoom="map.zoom">
									<map-control template="mockControl.tpl.html" position="ToP_LefT"></map-control>
								</google-map>
								"""
		element = @compile(html)(@scope)
		@rootScope.$apply()
		expect(@log.error).not.toHaveBeenCalled()