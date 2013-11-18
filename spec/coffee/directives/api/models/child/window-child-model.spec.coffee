describe("WindowChildModel", ->
	beforeEach( ->
		#dependencies
		#(scope,opts,isIconVisibleOnClick,mapCtrl, markerCtrl,$http,$templateCache,$compile)
		@scope = 
			coords:
				latitude: 90.0
				longitude: 89.0
			show: true
		@commonOpts = 
			position: new google.maps.LatLng(@scope.coords.latitude,@scope.coords.longitude)
		@windowOpts = _.extend(@commonOpts,content: 'content')
		@gMarker = new google.maps.Marker(@commonOpts)
		#define / inject values into the item we are testing... not a controller but it allows us to inject
		angular.module('mockModule',[])
		.value('isIconVisibleOnClick',true)
		.value('mapCtrl',document.gMap)
		.value('markerCtrl',@gMarker)
		.value('opts',@windowOpts)
        .value('element','<span>hi</span>')
		.value('needToManualDestroy',false)
		.controller('childModel', directives.api.models.child.WindowChildModel)

		angular.mock.module('mockModule')

		inject(($http,$rootScope,$templateCache,$compile,$controller) =>
			scope = $rootScope.$new()
			_.extend(@scope,scope)
			@subject = $controller('childModel', scope : scope )
		)
	)

	it( 'can be created', ->
		expect(@subject != undefined).toEqual(true)
		expect(@subject.index).toEqual(@index)
	)
)