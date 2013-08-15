@ngGmapModule "oo", ->
	baseObjectKeywords = ['extended', 'included']

	class @BaseObject
		@extend: (obj) ->
			for key, value of obj when key not in baseObjectKeywords
				@[key] = value
			obj.extended?.apply(0)
			this
		@include: (obj) ->
			for key, value of obj when key not in baseObjectKeywords
				#Assign properties to the prototype
				@::[key] = value
			obj.included?.apply(0)
			this