# stringify-object [![Build Status](https://secure.travis-ci.org/yeoman/stringify-object.png?branch=master)](http://travis-ci.org/yeoman/stringify-object)

Stringify an object/array like JSON.stringify just without all the double-quotes.

Useful for when you want to get the string representation of an object in a formatted way.

It also handles circular references and let's you specify quote type.


## Node.js

Install and add to package.json using npm: `npm install --save stringify-object`

```js
var stringifyObject = require('stringify-object');

var obj = {
    foo: 'bar',
    'arr': [1, 2, 3],
    nested: { hello: "world" }
};

var pretty = stringifyObject(obj, {
    indent: '  ',
    singleQuotes: false
});

console.log(pretty);
/*
{
  foo: "bar",
  arr: [1, 2, 3],
  nested: {
    hello: "world"
  }
}
*/
```

## Browser

Install with [Bower](https://github.com/twitter/bower): `bower install stringify-object`
 or [manually download it](https://raw.github.com/yeoman/stringify-object/master/stringify-object.js).

```html
<script src="stringify-object.js"></script>
```

```js
var obj = {
    foo: 'bar',
    'arr': [1, 2, 3],
    nested: { hello: "world" }
};

var pretty = stringifyObject(obj, {
    indent: '  ',
    singleQuotes: false
});

console.log(pretty);
/*
{
  foo: "bar",
  arr: [1, 2, 3],
  nested: {
    hello: "world"
  }
}
*/
```



## Documentation

### stringifyObject(object, [options])

Accepts an object to stringify and optionally an option object. Circular references will be replaced with `null`.

#### Options

##### indent

Type: `String`  
Default: `'\t'`

Choose the indentation you prefer.

##### singleQuotes

Type: `Boolean`  
Default: `true`

Set to false to get double-quoted strings.


## License

[BSD license](http://opensource.org/licenses/bsd-license.php) and copyright Google
