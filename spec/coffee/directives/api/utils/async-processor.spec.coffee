describe "AsyncProcessor", ->
	beforeEach( ->
		# Wait for the loading of the gmaps. This is simply when the <div> we use as a container has some html
        waitsFor(->
            return $('#ai1ec_map_canvas').html() != ''
        , "gmaps never loaded", 15000 )

		@subject = directives.api.utils.AsyncProcessor
	)

	it "handle array of 200 outputs 200 elements equal to the original, with 2 pauses", ->
		known = _.range(1000)
		test = []
		pauses = 1
		@subject.handleLargeArray(known,((num) -> test.push(num)),(()-> pauses++))
		expect(pauses).toEqual(10)
		expect(test.length).toEqual(known.length)
		expect(test).toEqual(known)

	it "handle array of 1000 outputs 1000 elements equal to the original, with 10 pauses", ->
	  known = _.range(1000)
	  test = []
	  pauses = 1
	  @subject.handleLargeArray(known,((num) -> test.push(num)),(()-> pauses++))
	  expect(pauses).toEqual(10)
	  expect(test.length).toEqual(known.length)
	  expect(test).toEqual(known)

