describe "MarkerChildModel", ->
	beforeEach( ->
		angular.module('mockModule',[])
		.value('index',0)
		.value('gMap',document.gMap)
		.value('defaults',{})
		.value('model',{})
		.value('gMarkerManager',new directives.api.managers.MarkerManager(document.gMap,undefined,undefined))
		.value('doClick',->
		)
		.value('model',{})
		.controller('childModel', directives.api.models.child.MarkerChildModel)

		angular.mock.module('mockModule')

		inject( ($timeout,$rootScope,$controller) =>
			scope = $rootScope.$new()
			scope.click = ->
			@subject = $controller('childModel', {
				parentScope : scope
			})
		)
	)

	it 'can be created', ->
		expect(@subject != undefined).toEqual(true)