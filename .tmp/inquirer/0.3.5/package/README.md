Inquirer.js  [![Build Status](https://travis-ci.org/SBoudrias/Inquirer.js.png?branch=master)](http://travis-ci.org/SBoudrias/Inquirer.js)
=====================

A collection of common interactive command line user interfaces.


Goal and philosophy
---------------------

We strive at providing easily embeddable and beautiful command line interface for Node.js ;
some hope in becoming the CLI Xanadu.

_Inquirer_ should ease the process of asking end user **questions**, **parsing**, **validating** answers, managing **hierarchical prompts** and providing **error feedback**.

_Inquirer_ provide the user interface, and the inquiry session flow. If you're searching for a full blown command line program utility, then check out [Commander.js](https://github.com/visionmedia/commander.js) (inspired by) or [Cli-color](https://github.com/medikoo/cli-color) (used internally).


Documentation
=====================


Installation
---------------------

``` prompt
npm install inquirer
```

```javascript
var inquirer = require("inquirer");
inquirer.prompt([/* Pass your questions in here */], function( answers ) {
	// Use user feedback for... whatever!!
});
```


Examples (Run it and see it)
---------------------

Checkout the `examples/` folder for code and interface examples.

``` prompt
node examples/pizza.js
# etc
```


Methods
---------------------

### `inquirer.prompt( questions, callback )`

Launch the prompt interface (inquiry session)

+ **questions** (Array) containing [Question Object](#question)
+ **callback** (Function) first parameter is the [Answers Object](#answers)


Objects
---------------------

### Question
A question object is a `hash` containing question related values:

+ **type**: (String) Type of the prompt. Defaults: `input` - Possible values: `input`, `confirm`,
`list`, `rawlist`
+ **name**: (String) The name to use when storing the answer in the anwers hash.
+ **message**: (String) The question to print.
+ **default**: (String|Function) Default value to use if nothing is entered, or a function that returns the default value. If defined as a function, the first parameter will be the current inquirer session answers. 
+ **choices**: (Array|Function) Choices array or a function returning a choices array. If defined as a function, the first parameter will be the current inquirer session answers.  
Array values can be simple `strings`, or `objects` containing a `name` (to display) and a `value` properties (to save in the answers hash). Values can also be [a `Separator`](#separator).
+ **validate**: (Function) Receive the user input and should return `true` if the value is valid, and an error message (`String`) otherwise. If `false` is returned, a default error message is provided.
+ **filter**: (Function) Receive the user input and return the filtered value to be used inside the program. The value returned will be added to the _Answers_ hash.
+ **when**: (Function) Receive the current user answers hash and should return `true` or `false` depending on wheter or not this question should be asked.

`validate`, `filter` and `when` functions can be asynchronously using `this.async()`. You just have to pass the value you'd normally return to the callback option.

``` javascript
{
  validate: function(input) {

    // Declare function as asynchronous, and save the done callback
    var done = this.async();

    // Do async stuff
    setTimeout(function() {
      if (typeof input !== "number") {
        // Pass the return value in the done callback
        done("You need to provide a number");
        return;
      }
      // Pass the return value in the done callback
      done(true);
    }, 3000);
  }
}
```

### Answers
A key/value hash containing the client answers in each prompt.

+ **Key** The `name` property of the _question_ object
+ **Value** (Depends on the prompt)
  + `confirm`: (Boolean)
  + `input` : User input (filtered if `filter` is defined) (String)
  + `rawlist`, `list` : Selected choice value (or name if no value specified) (String)

### Separator
A separator can be added to any `choices` array:

```
// In the question object
choices: [ "Choice A", new inquirer.Separator(), "choice B" ]

// Which'll be displayed this way
[?] What do you want to do?
 > Order a pizza
   Make a reservation
   --------
   Ask opening hours
   Talk to the receptionnist
```

The constructor takes a facultative `String` value that'll be use as the separator. If omitted, the separator will be `--------`.

Prompts type
---------------------

_allowed options written inside square brackets (`[]`) are optional. Others are required._

### List - `{ type: "list" }`

Take `type`, `name`, `message`, `choices`[, `default`, `filter`] properties. (Note that
default must be the choice `index` in the array)

![List prompt](https://dl.dropboxusercontent.com/u/59696254/inquirer/list-prompt.png)

### Raw List - `{ type: "rawlist" }`

Take `type`, `name`, `message`, `choices`[, `default`, `filter`] properties. (Note that
default must the choice `index` in the array)

![Raw list prompt](https://dl.dropboxusercontent.com/u/59696254/inquirer/rawlist-prompt.png)

### Expand - `{ type: "expand" }`

Take `type`, `name`, `message`, `choices`[, `default`, `filter`] properties. (Note that
default must be the choice `index` in the array)

Note that the `choice` object will take an extra parameter called `key` for the `expand` prompt. This parameter must be a single (lowercased) character. The `h` option is added by the prompt and shouldn't be defined by the user.

See `examples/expand.js` for a running example.

![Expand prompt closed](https://dl.dropboxusercontent.com/u/59696254/inquirer/expand-prompt-1.png)
![Expand prompt expanded](https://dl.dropboxusercontent.com/u/59696254/inquirer/expand-prompt-2.png)


### Checkbox - `{ type: "checkbox" }`

Take `type`, `name`, `message`, `choices`[, `filter`, `validate`] properties.

Choices marked as `{ checked: true }` will be checked by default.

![Checkbox prompt](https://dl.dropboxusercontent.com/u/59696254/inquirer/checkbox-prompt.png)

### Confirm - `{ type: "confirm" }`

Take `type`, `name`, `message`[, `default`] properties. `default` is expected to be a boolean if used.

![Confirm prompt](https://dl.dropboxusercontent.com/u/59696254/inquirer/confirm-prompt.png)

### Input - `{ type: "input" }`

Take `type`, `name`, `message`[, `default`, `filter`, `validate`] properties.

![Input prompt](https://dl.dropboxusercontent.com/u/59696254/inquirer/input-prompt.png)

### Password - `{ type: "password" }`

Take `type`, `name`, `message`[, `default`, `filter`, `validate`] properties.

![Password prompt](https://dl.dropboxusercontent.com/u/59696254/inquirer/password-prompt.png)



Support (OS - terminals)
=====================

You should expect mostly good support for the CLI below. This does not mean we won't
look at issues found on other command line - feel free to report any!

- **Mac OS**:
  - Terminal.app
  - iTerm
- **Windows**:
  - cmd.exe
  - Powershell
  - Cygwin
- **Ubuntu**:
  - Terminal


News on the march (Release notes)
=====================

Please refer to the [Github releases section for the changelog](https://github.com/SBoudrias/Inquirer.js/releases)


Contributing
=====================

**Style Guide**: Please base yourself on [Idiomatic.js](https://github.com/rwldrn/idiomatic.js) style guide with two space indent  
**Unit test**: Unit test are wrote in Mocha. Please add a unit test for every new feature
or bug fix. `npm test` to run the test suite.  
**Documentation**: Add documentation for every API change. Feel free to send corrections
or better docs!  
**Pull Requests**: Send _fixes_ PR on the `master` branch. Any new features should be send on the `wip`branch.

We're looking to offer good support for multiple prompts and environments. If you want to
help, we'd like to keep a list of testers for each terminal/OS so we can contact you and
get feedback before release. Let us know if you want to be added to the list (just tweet
to @vaxilart) or just add your name to [the wiki](https://github.com/SBoudrias/Inquirer.js/wiki/Testers)

License
=====================

Copyright (c) 2012 Simon Boudrias (twitter: @vaxilart)  
Licensed under the MIT license.
