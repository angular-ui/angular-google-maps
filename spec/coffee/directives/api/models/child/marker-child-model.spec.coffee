describe "MarkerChildModel", ->
	beforeEach( ->
		#comparison variables
		@index = 0 
		@model = 
			icon:'icon.png'
			coords:
				latitude:90
				longitude:90
			options: 
				animation:google.maps.Animation.BOUNCE
		@iconKey = 'icon'
		@coordsKey = 'coord'
		@optionsKey = 'options'

		#define / inject values into the item we are testing... not a controller but it allows us to inject
		angular.module('mockModule',[])
		.value('index',@index)
		.value('gMap',document.gMap)
		.value('defaults',{})
		.value('model', @model)
		.value('gMarkerManager',new directives.api.managers.MarkerManager(document.gMap,undefined,undefined))
		.value('doClick',->
		)
		.value('model',{})
		.controller('childModel', directives.api.models.child.MarkerChildModel)

		angular.mock.module('mockModule')

		inject( ($timeout,$rootScope,$controller) =>
			scope = $rootScope.$new()
			scope.click = ->
			scope.icon = @iconKey
			scope.coords = @coordsKey
			scope.options = @optionsKey
			@subject = $controller('childModel', {
				parentScope : scope
			})
		)
	)

	it 'can be created', ->
		expect(@subject != undefined).toEqual(true)
		expect(@subject.index).toEqual(@index)
		
	it 'parentScope keys are set correctly', ->
		expect(@subject.iconKey).toEqual(@iconKey)
		expect(@subject.coordsKey).toEqual(@coordsKey)
		expect(@subject.optionsKey).toEqual(@optionsKey)

	describe 'destroy()', ->
		it 'wipes internal scope', ->
			@subject.destroy()
			expect(@subject.myScope.$$destroyed).toEqual(true)

		it 'wipes gMarker', ->
			@subject.destroy()
			expect(@subject.gMarker).toEqual(undefined)
			expect(@subject.gMarkerManager.gMarkers.length).toEqual(0)