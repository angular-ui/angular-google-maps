angular.module('uiGmapgoogle-maps.extensions')
.service 'uiGmapLodash', ->

  unless _.get?#fill dependency if missing
    # Used to match property names within property paths.
    reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/
    reIsPlainProp = /^\w*$/
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g
    ###*
    # Converts `value` to an object if it's not one.
    #
    # @private
    # @param {*} value The value to process.
    # @returns {Object} Returns the object.
    ###
    toObject = (value) ->
      if _.isObject(value) then value else Object(value)

    ###*
    # Converts `value` to a string if it's not one. An empty string is returned
    # for `null` or `undefined` values.
    #
    # @private
    # @param {*} value The value to process.
    # @returns {string} Returns the string.
    ###

    baseToString = (value) ->
      if value == null then '' else value + ''

    ###*
    # Converts `value` to property path array if it's not one.
    #
    # @private
    # @param {*} value The value to process.
    # @returns {Array} Returns the property path array.
    ###

    toPath = (value) ->
      if _.isArray(value)
        return value
      result = []
      baseToString(value).replace rePropName, (match, number, quote, string) ->
        result.push if quote then string.replace(reEscapeChar, '$1') else number or match
        return
      result
    ###*
    # The base implementation of `get` without support for string paths
    # and default values.
    #
    # @private
    # @param {Object} object The object to query.
    # @param {Array} path The path of the property to get.
    # @param {string} [pathKey] The key representation of path.
    # @returns {*} Returns the resolved value.
    ###

    baseGet = (object, path, pathKey) ->
      if object == null
        return
      if pathKey != undefined and pathKey of toObject(object)
        path = [ pathKey ]
      index = 0
      length = path.length
      while !_.isUndefined(object) and index < length
        object = object[path[index++]]
      if index and index == length then object else undefined

    ###*
    # Gets the property value at `path` of `object`. If the resolved value is
    # `undefined` the `defaultValue` is used in its place.
    #
    # @static
    # @memberOf _
    # @category Object
    # @param {Object} object The object to query.
    # @param {Array|string} path The path of the property to get.
    # @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
    # @returns {*} Returns the resolved value.
    # @example
    #
    # var object = { 'a': [{ 'b': { 'c': 3 } }] };
    #
    # _.get(object, 'a[0].b.c');
    # // => 3
    #
    # _.get(object, ['a', '0', 'b', 'c']);
    # // => 3
    #
    # _.get(object, 'a.b.c', 'default');
    # // => 'default'
    ###

    get = (object, path, defaultValue) ->
      result = if object == null then undefined else baseGet(object, toPath(path), path + '')
      if result == undefined then defaultValue else result

    _.get = get
  ###
      Author Nick McCready
      Intersection of Objects if the arrays have something in common each intersecting object will be returned
      in an new array.
  ###
  @intersectionObjects = (array1, array2, comparison = undefined) ->
      res = _.map array1, (obj1) =>
          _.find array2, (obj2) =>
              if comparison?
                  comparison(obj1, obj2)
              else
                  _.isEqual(obj1, obj2)
      _.filter res, (o) ->
          o?

  # Determine if the array or object contains a given value (using `===`).
  #Aliased as `include`.
  @containsObject = _.includeObject = (obj, target, comparison = undefined) ->
      if (obj == null)
          return false
      #    if (nativeIndexOf && obj.indexOf == nativeIndexOf)
      #        return obj.indexOf(target) != -1
      _.any obj, (value) =>
          if comparison?
              comparison value, target
          else
              _.isEqual value, target


  @differenceObjects = (array1, array2, comparison = undefined) ->
      _.filter array1, (value) =>
          !@containsObject array2, value, comparison

  #alias to differenceObjects
  @withoutObjects = @differenceObjects

  @indexOfObject = (array, item, comparison, isSorted) ->
      return -1  unless array?
      i = 0
      length = array.length
      if isSorted
          if typeof isSorted is "number"
              i = ((if isSorted < 0 then Math.max(0, length + isSorted) else isSorted))
          else
              i = _.sortedIndex(array, item)
              return (if array[i] is item then i else -1)
      while i < length
          if comparison?
              return i if comparison array[i], item
          else
              return i if _.isEqual array[i], item
          i++
      -1

  @isNullOrUndefined = (thing) ->
    _.isNull thing or _.isUndefined thing
  @
