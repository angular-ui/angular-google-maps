@ngGmapModule = (names, fn = ()->) ->
	names = names.split '.' if typeof names is 'string'
	space = @[names.shift()] ||= {}
	space.ngGmapModule ||= @ngGmapModule
	if names.length
		space.ngGmapModule names, fn
	else
		fn.call space