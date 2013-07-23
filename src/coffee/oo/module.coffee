@module = (names, fn) ->
	names = names.split '.' if typeof names is 'string'
	space = @[names.shift()] ||= {}
	space.module ||= @module
	if names.length
		space.module names, fn
	else
		fn.call space